import json, shutil, logging
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlmodel import SQLModel, Session, create_engine, select

from .models import Case, Doc
from .ocr import extract_text_from_pdf
from .dedupe import DeDupeIndex
from .parse import guess_date, guess_doc_type, guess_provider
from .llm import ollama_chat, build_doc_prompt, build_case_prompt
from .utils import make_slug
from .settings import settings
from .schemas import CaseAPI, CaseMeta, DocOut
from typing import Iterable

log = logging.getLogger("caselens")

def _is_pdf_filename(name: str) -> bool:
    return name.lower().endswith(".pdf")

def _looks_like_pdf(path: Path) -> bool:
    try:
        with open(path, "rb") as fh:
            return fh.read(5) == b"%PDF-"
    except Exception:
        return False


BASE = Path(__file__).resolve().parent
DATA = settings.DATA_DIR
UPLOADS = DATA / "uploads"
WORK = DATA / "work"
for p in (UPLOADS, WORK):
    p.mkdir(parents=True, exist_ok=True)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

engine = create_engine(f"sqlite:///{settings.DB_PATH}")
SQLModel.metadata.create_all(engine)

@app.get("/health")
def health():
    return {"ok": True}


@app.post("/upload")
async def upload(case_name: str = Form(...), files: list[UploadFile] = File(...)):
    """
    Accept only real PDFs. Skip non-PDFs and any file that fails to open.
    On success, return { case_id } so the frontend can navigate to /case/{id}.
    """
    case_slug = make_slug(case_name)
    with Session(engine) as s:
        c = Case(name=case_name)
        s.add(c)
        s.commit()
        s.refresh(c)

        case_id = c.id
        ix = DeDupeIndex()
        case_dir = UPLOADS / f"case_{case_id}_{case_slug}"
        case_dir.mkdir(parents=True, exist_ok=True)

        for f in files:
            # 1) quick filename check
            if not _is_pdf_filename(f.filename or ""):
                # ignore non-PDF (e.g., .url) without crashing the whole request
                continue

            dest = case_dir / f.filename

            # 2) save first so we can magic-byte check
            with dest.open("wb") as out:
                shutil.copyfileobj(f.file, out)

            # 3) robust signature check
            if not _looks_like_pdf(dest):
                dest.unlink(missing_ok=True)
                continue

            # 4) OCR / text extraction with guard
            try:
                text = extract_text_from_pdf(str(dest))
            except Exception as e:
                # corrupt / unreadable file — skip
                log.warning("Skipping unreadable PDF %s: %s", dest.name, e)
                continue

            # 5) dedupe + insert
            is_dup, _ = ix.is_duplicate(text)
            if is_dup:
                continue

            ix.add(dest.name, text)
            d = Doc(
                case_id=c.id,
                filename=f.filename,
                slug=make_slug(f.filename),
                page_count=0,
                text=text,
                hash_sig="lsh",
                doc_type=guess_doc_type(text),
                provider=guess_provider(text),
                date_str=guess_date(text),
            )
            s.add(d)

        s.commit()
    _ensure_ai_cache(case_id)   # <- call LLM + write caches here (sync)
    return JSONResponse({"case_id": case_id}, status_code=201, headers={"Location": f"/api/case/{case_id}"})

def _ensure_ai_cache(case_id: int) -> None:
    with Session(engine) as s:
        docs = s.exec(select(Doc).where(Doc.case_id == case_id)).all()

    def sort_key(d):  # type: ignore
        return (d.date_str or "9999-12-31", d.filename)
    docs_sorted = sorted(docs, key=sort_key)

    hl_dir = WORK / f"case_{case_id}"
    hl_dir.mkdir(exist_ok=True)
    highlights_raw = []

    for d in docs_sorted:
        cache = hl_dir / f"{d.id}_{d.slug}.json"
        if cache.exists():
            try:
                raw = json.loads(cache.read_text()).get("raw", "")
            except Exception:
                raw = cache.read_text()
        else:
            prompt = build_doc_prompt(d.text)
            raw = ollama_chat(prompt)
            cache.write_text(json.dumps({"raw": raw}, ensure_ascii=False))
        highlights_raw.append(raw)

    # case-level summary
    case_cache = hl_dir / "case_summary.json"
    if not case_cache.exists():
        prompt = build_case_prompt(highlights_raw)
        out = ollama_chat(prompt)
        case_cache.write_text(json.dumps({"raw": out}, ensure_ascii=False))

@app.get("/api/case/{case_id}", response_model=CaseAPI)
def api_case(case_id: int):
    with Session(engine) as s:
        c = s.get(Case, case_id)
        if not c:
            raise HTTPException(404, "Not found")
        docs = s.exec(select(Doc).where(Doc.case_id == case_id)).all()

    def sort_key(x):  # type: ignore
        return (x.date_str or "9999-12-31", x.filename)
    docs_sorted = sorted(docs, key=sort_key)

    # read cached highlights/summary
    hl_dir = WORK / f"case_{case_id}"
    highlights: dict[int, str] = {}
    for d in docs_sorted:
        cache = hl_dir / f"{d.id}_{d.slug}.json"
        if cache.exists():
            try:
                raw = json.loads(cache.read_text()).get("raw", "")
            except Exception:
                raw = cache.read_text()
            highlights[d.id] = raw

    case_summary_raw = ""
    case_cache = hl_dir / "case_summary.json"
    if case_cache.exists():
        try:
            case_summary_raw = json.loads(case_cache.read_text()).get("raw", "")
        except Exception:
            case_summary_raw = case_cache.read_text()

    return CaseAPI(
        meta=CaseMeta(id=c.id, name=c.name, created_at=str(c.created_at)),
        docs=[DocOut(
            id=d.id, filename=d.filename, slug=d.slug, page_count=d.page_count,
            doc_type=d.doc_type, provider=d.provider, date_str=d.date_str
        ) for d in docs_sorted],
        highlightsRaw=highlights,
        caseSummaryRaw=case_summary_raw,
    )

@app.get("/export/{case_id}.json")
def export_json(case_id: int):
    with Session(engine) as s:
        c = s.get(Case, case_id)
        if not c:
            raise HTTPException(404, "Not found")
        docs = s.exec(select(Doc).where(Doc.case_id == case_id)).all()
    payload = {
        "case": {"id": c.id, "name": c.name, "created_at": str(c.created_at)},
        "docs": [
            {
                "id": d.id, "filename": d.filename, "date": d.date_str,
                "provider": d.provider, "doc_type": d.doc_type,
            } for d in docs
        ],
    }
    return JSONResponse(payload)
