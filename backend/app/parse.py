import re
from datetime import datetime


date_re = re.compile(r"(20\d{2}|19\d{2})[-/.](\d{1,2})[-/.](\d{1,2})|\b(\d{1,2})/(\d{1,2})/(\d{2,4})\b")


def guess_date(text: str) -> str | None:
    m = date_re.search(text)
    if not m:
        return None
    s = m.group(0)
    for fmt in ("%Y-%m-%d", "%Y/%m/%d", "%Y.%m.%d", "%m/%d/%Y", "%m/%d/%y"):
        try:
            return datetime.strptime(s, fmt).strftime("%Y-%m-%d")
        except Exception:
            continue
    return None


def guess_doc_type(text: str) -> str | None:
    t = text.lower()
    if "discharge summary" in t: return "discharge_summary"
    if "operative report" in t: return "operative_report"
    if "radiology" in t or "imaging" in t: return "radiology"
    if "billing" in t or "invoice" in t: return "billing"
    if "clinic note" in t or "progress note" in t: return "progress_note"
    return None


def guess_provider(text: str) -> str | None:
# very light heuristic
    lines = [l.strip() for l in text.splitlines() if l.strip()]
    for l in lines[:20]:
        if ", md" in l.lower() or ", do" in l.lower() or "hospital" in l.lower():
            return l[:120]
    return None