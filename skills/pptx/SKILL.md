---
name: pptx
description: "Use when user asks to create or edit PowerPoint presentations. Triggers: 'apresentação', 'slides PowerPoint', 'criar PPTX', 'criar apresentação', 'slides de apresentação'"
---

# PPTX Skill - PowerPoint Presentation Creation

## When to Use
- Create PowerPoint presentations
- Edit existing .pptx files
- Add slides, shapes, charts
- Format presentations
- Create presentation templates

## Portuguese Triggers
- "criar apresentação"
- "slides PowerPoint"
- "criar PPTX"
- "editar apresentação"
- "slides de apresentação"
- "deck de slides"

## Python Library
```python
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RgbColor
from pptx.enum.text import PP_ALIGN
```

## Basic Presentation

### Create Presentation
```python
from pptx import Presentation

def create_presentation(filename, title):
    prs = Presentation()
    prs.slide_width = Inches(10)
    prs.slide_height = Inches(7.5)
    
    # Title slide
    slide_layout = prs.slide_layouts[0]  # Title layout
    slide = prs.slides.add_slide(slide_layout)
    title_shape = slide.shapes.title
    title_shape.text = title
    
    prs.save(filename)
```

### Add Multiple Slides
```python
from pptx import Presentation

def create_multi_slide(filename, slides_content):
    prs = Presentation()
    
    for i, content in enumerate(slides_content):
        # Use Title and Content layout
        slide_layout = prs.slide_layouts[1]
        slide = prs.slides.add_slide(slide_layout)
        
        title = slide.shapes.title
        title.text = content.get('title', f'Slide {i+1}')
        
        # Add content
        for shape in slide.placeholders:
            if shape.placeholder_format.idx == 1:  # Content placeholder
                tf = shape.text_frame
                tf.text = content.get('body', '')
    
    prs.save(filename)
```

## Slide Content

### Add Text Box
```python
from pptx import Presentation
from pptx.util import Inches, Pt

def add_textbox(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])  # Blank
    
    # Add text box
    left = Inches(1)
    top = Inches(2)
    width = Inches(8)
    height = Inches(2)
    
    textbox = slide.shapes.add_textbox(left, top, width, height)
    tf = textbox.text_frame
    tf.text = "Hello World!"
    
    # Format
    p = tf.paragraphs[0]
    p.font.size = Pt(24)
    p.font.bold = True
    p.alignment = PP_ALIGN.CENTER
```

### Add Bullet Points
```python
def add_bullets(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[1])
    
    for shape in slide.placeholders:
        if shape.placeholder_format.idx == 1:
            tf = shape.text_frame
            tf.clear()
            
            bullets = ['First point', 'Second point', 'Third point']
            for i, bullet in enumerate(bullets):
                if i == 0:
                    p = tf.paragraphs[0]
                else:
                    p = tf.add_paragraph()
                p.text = bullet
                p.level = 0
```

### Add Tables
```python
from pptx import Presentation
from pptx.util import Inches

def add_table(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    # Add table
    rows = 3
    cols = 3
    left = Inches(1)
    top = Inches(2)
    width = Inches(8)
    height = Inches(2)
    
    table = slide.shapes.add_table(rows, cols, left, top, width, height).table
    
    # Set column widths
    table.columns[0].width = Inches(2)
    table.columns[1].width = Inches(3)
    table.columns[2].width = Inches(3)
    
    # Add data
    data = [
        ['Name', 'Age', 'City'],
        ['John', '30', 'NYC'],
        ['Jane', '25', 'LA']
    ]
    
    for row_idx, row_data in enumerate(data):
        for col_idx, cell_text in enumerate(row_data):
            cell = table.cell(row_idx, col_idx)
            cell.text = cell_text
```

## Formatting

### Slide Background
```python
from pptx.util import Inches
from pptx.dml.color import RgbColor

def set_background(prs, r, g, b):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = RgbColor(r, g, b)
```

### Text Formatting
```python
from pptx.util import Pt
from pptx.dml.color import RgbColor

def format_text(text_frame):
    for paragraph in text_frame.paragraphs:
        for run in paragraph.runs:
            run.font.size = Pt(14)
            run.font.bold = True
            run.font.italic = True
            run.font.color.rgb = RgbColor(0, 0, 255)
```

## Charts
```python
from pptx import Presentation
from pptx.util import Inches

def add_chart(prs):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    
    # Add chart (requires data)
    chart_data = [
        ['Category', 'Value'],
        ['A', 30],
        ['B', 50],
        ['C', 20]
    ]
    
    x, y, cx, cy = Inches(1), Inches(2), Inches(6), Inches(4)
    chart = slide.shapes.add_chart(
        3,  # Bar chart type
        x, y, cx, cy,
        chart_data
    ).chart  # Returns chart object
```

## Templates

### Create Template
```python
from pptx import Presentation
from pptx.util import Inches

def create_template(filename):
    prs = Presentation()
    
    # Title slide template
    title_layout = prs.slide_layouts[0]
    title_slide = prs.slides.add_slide(title_layout)
    title_slide.shapes.title.text = "Template Title"
    
    # Content slide template
    content_layout = prs.slide_layouts[1]
    content_slide = prs.slides.add_slide(content_layout)
    content_slide.shapes.title.text = "Section Title"
    
    # Section header template
    section_layout = prs.slide_layouts[2]
    
    prs.save(filename)
```

## Presentation from Outline
```python
def outline_to_presentation(outline, output_file):
    """
    outline = [
        {'type': 'title', 'text': 'Main Title'},
        {'type': 'section', 'text': 'Section 1'},
        {'type': 'content', 'text': 'Bullet 1'},
        {'type': 'content', 'text': 'Bullet 2'},
        {'type': 'section', 'text': 'Section 2'},
        {'type': 'content', 'text': 'More content'},
    ]
    """
    prs = Presentation()
    
    for item in outline:
        if item['type'] == 'title':
            slide = prs.slides.add_slide(prs.slide_layouts[0])
            slide.shapes.title.text = item['text']
        
        elif item['type'] == 'section':
            slide = prs.slides.add_slide(prs.slide_layouts[2])  # Section header
            slide.shapes.title.text = item['text']
        
        elif item['type'] == 'content':
            # Reuse last slide or create new
            if not prs.slides or prs.slides[-1].shapes.title.text.startswith('Section'):
                slide = prs.slides.add_slide(prs.slide_layouts[1])
                slide.shapes.title.text = "Content"
            # Add to content placeholder
            for shape in prs.slides[-1].placeholders:
                if shape.placeholder_format.idx == 1:
                    p = shape.text_frame.add_paragraph()
                    p.text = item['text']
    
    prs.save(output_file)
```

## Related Skills
- pdf: PDF creation
- docx: Word document creation
- xlsx: Excel spreadsheet
- hyperframes: Video/animation creation
- frontend-slides: HTML presentation creation