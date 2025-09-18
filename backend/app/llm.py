import subprocess
import json
from typing import Iterable, Optional

ALLOWED_DOC_TYPES = ["progress_note", "radiology_report", "billing_invoice", "discharge_summary", "operative_report"]

SUMMARY_SYS = (
    "You are an information extractor for medical-legal documents.\n"
    "OUTPUT MUST CONTAIN EXACTLY TWO TAGGED BLOCKS (no extra text):\n"
    "<CASE_SUMMARY> ... </CASE_SUMMARY>\n"
    "<FACTS_JSON> ... </FACTS_JSON>\n"
    "Rules:\n"
    "1) Do NOT use markdown, asterisks, numbering, or decorative characters.\n"
    "2) Extract ONLY facts explicitly present in the provided TEXT. Never invent or infer dates, providers, or diagnoses.\n"
    "3) If a value is not present in TEXT, use null (JSON null) for that field.\n"
    "4) doc_type MUST be one of: " + ", ".join(ALLOWED_DOC_TYPES) + " ; if unknown, use null.\n"
    "5) ONE DOCUMENT → AT MOST ONE OBJECT in FACTS_JSON, unless the TEXT clearly contains multiple distinct encounters with different dates/providers.\n"
    "6) If a document lists multiple services for the SAME date/provider (e.g., a billing invoice), they MUST be combined in a single object's 'treatments' array; DO NOT create extra objects with null fields.\n"
    "7) Dates: output in YYYY-MM-DD only if that exact date appears in TEXT; otherwise null. Never fabricate dates.\n"
    "8) 'diagnoses' and 'treatments' MUST be JSON arrays (strings inside). Keep them short and factual from TEXT.\n"
    "9) Keep CASE_SUMMARY to 3-6 plain lines starting with '-' (hyphen) only.\n"
)

DOC_PROMPT_TMPL = (
    "{sys}\n\n"
    "Produce the two blocks for THIS SINGLE DOCUMENT.\n"
    "TEXT:\n{doc_text}\n\n"
    "Return only the two blocks delimited by tags."
).strip()

CASE_PROMPT_TMPL = (
    "{sys}\n\n"
    "You are merging highlights from multiple documents of a single case.\n"
    "Combine them into:\n"
    "1) <CASE_SUMMARY> with 3-6 lines starting with '-' (hyphen) only.\n"
    "2) <FACTS_JSON> as a JSON list where each object corresponds to one source document.\n"
    "Enforce Rules 1-9 strictly. Never invent values not present in the input highlights.\n\n"
    "INPUT HIGHLIGHTS:\n{highlights}\n\n"
    "Return only the two tagged blocks."
).strip()


FEW_SHOT_EXAMPLE = ""


def _safe_run_ollama(args: list[str], prompt: str) -> str:
    """
    Run 'ollama run <model> <prompt>' with binary I/O and safe decoding.
    Avoids Windows cp1252 UnicodeDecodeError by decoding as UTF-8 with 'replace'.
    """
    proc = subprocess.run(
        args + [prompt],
        capture_output=True,
    )
    # Decode safely regardless of platform
    stdout = (proc.stdout or b"").decode("utf-8", errors="replace")
    stderr = (proc.stderr or b"").decode("utf-8", errors="replace")

    if proc.returncode != 0:
        raise RuntimeError(f"Ollama CLI failed (code {proc.returncode}): {stderr.strip() or 'unknown error'}")

    out = stdout.strip()
    if not out:
        # If model returned nothing, surface a clear error (don’t cache empty)
        raise RuntimeError("Ollama returned empty output")
    return out


def ollama_chat(
    prompt: str,
    model: str = "llama3.1:8b",
) -> str:
    """
    Minimal wrapper over 'ollama run'. We only pass model and prompt to keep CLI stable.
    (If you need temperature/num_predict, switch to Ollama HTTP API for reliable control.)
    """
    return _safe_run_ollama(["ollama", "run", model], prompt)


def build_doc_prompt(
    doc_text: str,
    sys: str = SUMMARY_SYS,
    few_shot: Optional[str] = FEW_SHOT_EXAMPLE,
    max_chars: int = 9000,
) -> str:
    return DOC_PROMPT_TMPL.format(
        sys=sys,
        few_shot=(few_shot or ""),
        doc_text=doc_text[:max_chars],
    )


def build_case_prompt(
    highlights: Iterable[str],
    sys: str = SUMMARY_SYS,
    few_shot: Optional[str] = FEW_SHOT_EXAMPLE,
    max_chars: int = 12000,
) -> str:
    merged = "\n\n".join(h[:max_chars] for h in highlights if h)
    return CASE_PROMPT_TMPL.format(
        sys=sys,
        few_shot=(few_shot or ""),
        highlights=merged[:max_chars],
    )
