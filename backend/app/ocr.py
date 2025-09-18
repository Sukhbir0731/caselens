import io
import fitz # PyMuPDF
import pytesseract
from PIL import Image

def extract_text_from_pdf(path: str) -> str:
    # If it's not a real PDF or corrupt, let the caller handle the exception.
    doc = fitz.open(path)

    chunks: list[str] = []
    for page in doc:
        # Use embedded text if present
        text = page.get_text("text") or ""
        if text.strip():
            chunks.append(text)
            continue
        # Fallback to OCR
        pix = page.get_pixmap(dpi=200)
        img = Image.open(io.BytesIO(pix.tobytes("png")))
        ocr_text = pytesseract.image_to_string(img)
        chunks.append(ocr_text)
    return "\n".join(chunks)