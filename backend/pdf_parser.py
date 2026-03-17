import PyPDF2 
import os 
import io 

def parse_pdf(file_bytes : bytes) -> str :
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))

    text = "" 
    for page in pdf_reader.pages:
        text += page.extract_text() + "\n"  

    text = "".join(text.split())

    return text 