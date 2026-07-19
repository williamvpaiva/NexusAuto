---
name: docx
description: "Use when user asks to create, edit, or convert Word documents (.docx). Triggers: 'documento Word', 'criar .docx', 'editar Word', 'converter para Word', 'relatório docx'"
---

# DOCX Skill - Microsoft Word Document Creation

## When to Use
- Create Word documents
- Edit existing .docx files
- Add formatting (headings, lists, tables)
- Mail merge operations
- Convert other formats to Word

## Portuguese Triggers
- "documento Word"
- "criar .docx"
- "editar documento"
- "converter para Word"
- "relatório docx"
- "cabeçalho Word"
- "tabela Word"

## Python Libraries

### python-docx (Primary)
```python
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
```

## Document Creation

### Basic Document
```python
from docx import Document

def create_docx(filename, title, content):
    doc = Document()
    
    # Title
    doc.add_heading(title, 0)
    
    # Paragraph
    doc.add_paragraph(content)
    
    doc.save(filename)
```

### With Formatting
```python
from docx import Document
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

def create_formatted_docx(filename):
    doc = Document()
    
    # Heading
    h1 = doc.add_heading('Main Title', 0)
    h1.alignment = WD_ALIGN_PARAGRAPH.CENTER
    
    # Subheading
    doc.add_heading('Subtitle', level=1)
    
    # Paragraph with formatting
    p = doc.add_paragraph()
    run = p.add_run('This is bold text')
    run.bold = True
    run.font.size = Pt(14)
    
    run2 = p.add_run(' and this is italic text')
    run2.italic = True
    
    # Colored text
    run3 = p.add_run('Colored text')
    run3.font.color.rgb = RGBColor(255, 0, 0)
    
    doc.save(filename)
```

### Lists
```python
from docx import Document

def create_list_docx(filename):
    doc = Document()
    
    # Bullet list
    doc.add_heading('Bullet List', level=1)
    for item in ['Item 1', 'Item 2', 'Item 3']:
        doc.add_paragraph(item, style='List Bullet')
    
    # Numbered list
    doc.add_heading('Numbered List', level=1)
    for item in ['First', 'Second', 'Third']:
        doc.add_paragraph(item, style='List Number')
    
    doc.save(filename)
```

### Tables
```python
from docx import Document
from docx.shared import Inches

def create_table_docx(filename, headers, data):
    doc = Document()
    doc.add_heading('Data Table', 0)
    
    table = doc.add_table(rows=1, cols=len(headers))
    
    # Header row
    hdr_cells = table.rows[0].cells
    for i, header in enumerate(headers):
        hdr_cells[i].text = header
        # Bold header
        for paragraph in hdr_cells[i].paragraphs:
            for run in paragraph.runs:
                run.bold = True
    
    # Data rows
    for row_data in data:
        row_cells = table.add_row().cells
        for i, cell_data in enumerate(row_data):
            row_cells[i].text = str(cell_data)
    
    doc.save(filename)
```

## Document Manipulation

### Read Existing Document
```python
from docx import Document

def read_docx(filename):
    doc = Document(filename)
    
    for para in doc.paragraphs:
        print(para.text)
    
    for table in doc.tables:
        for row in table.rows:
            row_data = [cell.text for cell in row.cells]
            print(row_data)
```

### Add Page Breaks
```python
from docx import Document
from docx.enum.text import WD_BREAK

def add_page_break(filename):
    doc = Document()
    
    doc.add_paragraph('Page 1 content')
    
    # Add page break
    doc.add_page_break()
    
    doc.add_paragraph('Page 2 content')
    
    doc.save(filename)
```

### Headers and Footers
```python
from docx import Document

def add_header_footer(filename):
    doc = Document()
    
    # Header
    section = doc.sections[0]
    header = section.header
    header_para = header.paragraphs[0]
    header_para.text = "Header Text"
    
    # Footer
    footer = section.footer
    footer_para = footer.paragraphs[0]
    footer_para.text = "Footer Text - Page "
    
    doc.save(filename)
```

## Document Conversion

### Markdown to DOCX
```python
from docx import Document
import re

def markdown_to_docx(md_text, filename):
    doc = Document()
    
    lines = md_text.split('\n')
    for line in lines:
        if line.startswith('# '):
            doc.add_heading(line[2:], 0)
        elif line.startswith('## '):
            doc.add_heading(line[3:], 1)
        elif line.startswith('### '):
            doc.add_heading(line[4:], 2)
        elif line.startswith('- '):
            doc.add_paragraph(line[2:], style='List Bullet')
        elif line.strip():
            doc.add_paragraph(line)
    
    doc.save(filename)
```

## Styles

### Custom Styles
```python
from docx import Document
from docx.shared import Pt
from docx.enum.style import WD_STYLE_TYPE

def create_custom_styles(filename):
    doc = Document()
    
    # Create custom paragraph style
    style = doc.styles.add_style('CustomStyle', WD_STYLE_TYPE.PARAGRAPH)
    style.font.name = 'Arial'
    style.font.size = Pt(12)
    style.paragraph_format.space_after = Pt(6)
    
    # Use custom style
    doc.add_paragraph('Styled text', style='CustomStyle')
    
    doc.save(filename)
```

## Related Skills
- pdf: PDF creation
- pptx: PowerPoint creation
- xlsx: Excel creation
- office-productivity: General Office workflows
- doc-coauthoring: Collaborative document creation