from typing import Optional, List
from pydantic import BaseModel

class DocOut(BaseModel):
    id: int
    filename: str
    slug: str
    page_count: int
    doc_type: Optional[str] = None
    provider: Optional[str] = None
    date_str: Optional[str] = None

class CaseMeta(BaseModel):
    id: int
    name: str
    created_at: str

class CaseAPI(BaseModel):
    meta: CaseMeta
    docs: List[DocOut]
    highlightsRaw: dict[int, str]
    caseSummaryRaw: str
