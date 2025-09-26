from typing import Optional, List
from pydantic import BaseModel
from sqlmodel import SQLModel

class DocOut(BaseModel):
    id: int
    filename: str
    slug: str
    page_count: int
    doc_type: Optional[str] = None
    provider: Optional[str] = None
    date_str: Optional[str] = None

class CaseListOut(SQLModel):
    id: int
    name: str
    created_at: str

class CaseMeta(BaseModel):
    id: int
    name: str
    created_at: str

class CaseAPI(BaseModel):
    meta: CaseMeta
    docs: List[DocOut]
    highlightsRaw: dict[int, str]
    caseSummaryRaw: str
