from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    CORS_ORIGINS: list[str] = ["http://127.0.0.1:5173", "http://localhost:5173"]
    DB_PATH: Path = Path(__file__).resolve().parent.parent / "data" / "caselens.db"
    DATA_DIR: Path = Path(__file__).resolve().parent.parent / "data"
    TESSERACT_PATH: str | None = None  # set via .env if needed

    class Config:
        env_file = Path(__file__).resolve().parent.parent / ".env"

settings = Settings()
