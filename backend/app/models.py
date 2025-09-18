from datetime import datetime, timezone
from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship


class Case(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    docs: List["Doc"] = Relationship(back_populates="case")

class Doc(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    case_id: int = Field(foreign_key="case.id")
    filename: str
    slug: str
    page_count: int
    text: str
    hash_sig: str
    doc_type: Optional[str] = None
    provider: Optional[str] = None
    date_str: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


    case: Case = Relationship(back_populates="docs")