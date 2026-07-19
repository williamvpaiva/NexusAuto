---
name: pdf
description: "Use when user asks to create, edit, analyze, or convert PDF files. Triggers: 'gerar PDF', 'criar PDF', 'converter para PDF', 'extrair texto do PDF', 'editar PDF'"
---

# PDF Skill - Document Creation & Manipulation

## When to Use
- Generate PDF from content
- Edit existing PDF
- Extract text/data from PDF
- Convert other formats to PDF
- PDF form filling
- Merge/split PDFs

## Portuguese Triggers
- "gerar PDF"
- "criar documento PDF"
- "converter para PDF"
- "extrair texto do PDF"
- "editar PDF"
- "mesclar PDFs"
- "dividir PDF"

## Python PDF Libraries

### ReportLab (PDF Generation)
```python
from reportlab.lib.pagesizes import A4, letter
from reportlab.pdfgen import canvas

def create_pdf(filename, content):
    c = canvas.Canvas(filename, pagesize=A4)
    c.drawString(100, 750, content)
    c.save()
```

### PyPDF2 (Manipulation)
```python
import PyPDF2

# Merge PDFs
def merge_pdfs(pdf_files, output_file):
    merger = PyPDF2.PdfMerger()
    for pdf in pdf_files:
        merger.append(pdf)
    merger.write(output_file)

# Extract text
def extract_text(pdf_file):
    with open(pdf_file, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
    return text
```

### pdfplumber (Advanced Extraction)
```python
import pdfplumber

def extract_tables(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            tables = page.extract_tables()
            for table in tables:
                print(table)
```

## PDF Creation Examples

### Simple Text PDF
```python
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch

def create_simple_pdf(filename, title, paragraphs):
    c = canvas.Canvas(filename, pagesize=A4)
    
    # Title
    c.setFont("Helvetica-Bold", 24)
    c.drawString(1*inch, 10*inch, title)
    
    # Paragraphs
    c.setFont("Helvetica", 12)
    y = 9*inch
    for para in paragraphs:
        c.drawString(1*inch, y, para)
        y -= 0.3*inch
    
    c.save()
```

### With Tables
```python
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet

def create_pdf_with_table(filename, data, headers):
    doc = SimpleDocTemplate(filename, pagesize=A4)
    elements = []
    
    # Header paragraphs
    styles = getSampleStyleSheet()
    elements.append(Paragraph("Report Title", styles['Title']))
    
    # Table
    table_data = [headers] + data
    t = Table(table_data)
    t.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), '#CCCCCC'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,-1), 10),
        ('GRID', (0,0), (-1,-1), 1, '#000000'),
    ]))
    elements.append(t)
    
    doc.build(elements)
```

### With Images
```python
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

def create_pdf_with_image(filename, image_path, text):
    c = canvas.Canvas(filename, pagesize=A4)
    
    # Add image
    c.drawImage(image_path, 100, 500, width=200, height=150)
    
    # Add text below
    c.setFont("Helvetica", 12)
    c.drawString(100, 450, text)
    
    c.save()
```

## PDF Text Extraction

### Simple Extraction
```python
import PyPDF2

def extract_all_text(pdf_path):
    text = ""
    with open(pdf_path, 'rb') as f:
        reader = PyPDF2.PdfReader(f)
        for i, page in enumerate(reader.pages):
            page_text = page.extract_text()
            text += f"\n--- Page {i+1} ---\n"
            text += page_text
    return text
```

### Structured Extraction (Tables)
```python
import pdfplumber

def extract_structured(pdf_path):
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            # Extract tables
            tables = page.extract_tables()
            for table in tables:
                yield table
            
            # Extract text with layout
            chars = page.chars
            # Process characters for precise positioning
```

## PDF Manipulation

### Merge Multiple PDFs
```python
from PyPDF2 import PdfMerger

def merge_pdfs(pdf_list, output_path):
    merger = PdfMerger()
    for pdf in pdf_list:
        merger.append(pdf)
    merger.write(output_path)
    merger.close()
```

### Split PDF
```python
from PyPDF2 import PdfReader, PdfWriter

def split_pdf(input_path, output_prefix):
    reader = PdfReader(input_path)
    for i, page in enumerate(reader.pages):
        writer = PdfWriter()
        writer.add_page(page)
        output_path = f"{output_prefix}_page_{i+1}.pdf"
        with open(output_path, 'wb') as f:
            writer.write(f)
```

### Rotate Pages
```python
from PyPDF2 import PdfReader, PdfWriter

def rotate_pdf(input_path, output_path, degrees=90):
    reader = PdfReader(input_path)
    writer = PdfWriter()
    
    for page in reader.pages:
        page.rotate(degrees)
        writer.add_page(page)
    
    with open(output_path, 'wb') as f:
        writer.write(f)
```

## PDF Form Filling

### with PyPDF2
```python
from PyPDF2 import PdfReader, PdfWriter

def fill_form(pdf_path, data, output_path):
    reader = PdfReader(pdf_path)
    writer = PdfWriter()
    
    for page in reader.pages:
        writer.add_page(page)
    
    # Note: Requires interactive form fields in PDF
    writer.update_page_form_field_values(
        writer.pages[0],
        data
    )
    
    with open(output_path, 'wb') as f:
        writer.write(f)
```

## Validation

### Check if Valid PDF
```python
import PyPDF2

def is_valid_pdf(file_path):
    try:
        with open(file_path, 'rb') as f:
            reader = PyPDF2.PdfReader(f)
            return len(reader.pages) > 0
    except Exception:
        return False
```

## Related Skills
- docx: Word document creation
- pptx: PowerPoint presentation
- xlsx: Excel spreadsheet creation
- office-productivity: General Office workflows