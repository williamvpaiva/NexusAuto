---
name: xlsx
description: "Use when user asks to create or edit Excel spreadsheets. Triggers: 'planilha Excel', 'criar XLSX', 'editar Excel', 'tabela Excel', 'gráfico Excel', 'fórmulas'"
---

# XLSX Skill - Excel Spreadsheet Creation

## When to Use
- Create Excel spreadsheets
- Add data, formulas, formatting
- Create charts and graphs
- Pivot tables
- Data analysis and reporting

## Portuguese Triggers
- "planilha Excel"
- "criar XLSX"
- "criar Excel"
- "tabela Excel"
- "gráfico"
- "fórmulas"
- "calcular no Excel"

## Python Libraries

### openpyxl (Primary)
```python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.chart import BarChart, LineChart, PieChart
from openpyxl.utils import get_column_letter
```

## Basic Spreadsheet

### Create Workbook
```python
from openpyxl import Workbook

def create_workbook(filename):
    wb = Workbook()
    ws = wb.active
    ws.title = "Sheet1"
    
    # Add data
    ws['A1'] = 'Name'
    ws['B1'] = 'Value'
    ws['A2'] = 'Item 1'
    ws['B2'] = 100
    
    wb.save(filename)
```

### Multiple Sheets
```python
from openpyxl import Workbook

def create_multi_sheet(filename, data_dict):
    wb = Workbook()
    
    # Remove default sheet
    if 'Sheet' in wb.sheetnames:
        del wb['Sheet']
    
    for sheet_name, data in data_dict.items():
        ws = wb.create_sheet(sheet_name)
        
        # Add data row by row
        for row_idx, row_data in enumerate(data, start=1):
            for col_idx, value in enumerate(row_data, start=1):
                ws.cell(row=row_idx, column=col_idx, value=value)
    
    wb.save(filename)
```

## Data Management

### Add Headers
```python
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

def add_formatted_headers(ws, headers):
    for col_idx, header in enumerate(headers, start=1):
        cell = ws.cell(row=1, column=col_idx, value=header)
        cell.font = Font(bold=True, color='FFFFFF')
        cell.fill = PatternFill(start_color='366092', end_color='366092', fill_type='solid')
        cell.alignment = Alignment(horizontal='center')
```

### Format Cells
```python
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.styles.numbers import FORMAT_NUMBER_COMMA_SEPARATED1

def format_data_cells(ws, start_row, end_row, num_cols):
    for row in range(start_row, end_row + 1):
        for col in range(1, num_cols + 1):
            cell = ws.cell(row=row, column=col)
            
            # Number format
            cell.number_format = FORMAT_NUMBER_COMMA_SEPARATED1
            
            # Border
            thin = Side(style='thin')
            cell.border = Border(left=thin, right=thin, top=thin, bottom=thin)
            
            # Alignment
            cell.alignment = Alignment(horizontal='center')
```

## Formulas

### Basic Formulas
```python
def add_formulas(ws):
    # Sum
    ws['C1'] = '=SUM(A1:B1)'
    
    # Average
    ws['C2'] = '=AVERAGE(A1:B1)'
    
    # Count
    ws['C3'] = '=COUNT(A1:A10)'
    
    # If
    ws['C4'] = '=IF(A1>10,"High","Low")'
    
    # VLOOKUP
    ws['C5'] = '=VLOOKUP(A1,Sheet2!A:C,3,FALSE)'
    
    # Concatenate
    ws['C6'] = '=CONCATENATE(A1," ",B1)'
```

### Complex Formulas
```python
def add_advanced_formulas(ws):
    # SUMIF
    ws['D1'] = '=SUMIF(A1:A10,">100",B1:B10)'
    
    # COUNTIF
    ws['D2'] = '=COUNTIF(A1:A10,"Category")'
    
    # INDEX/MATCH
    ws['D3'] = '=INDEX(B1:B10,MATCH("Item",A1:A10,0))'
    
    # Nested IF
    ws['D4'] = '=IF(A1>=90,"A",IF(A1>=80,"B",IF(A1>=70,"C","F")))'
    
    # SUMPRODUCT
    ws['D5'] = '=SUMPRODUCT((A1:A10="X")*(B1:B10))'
```

## Charts

### Bar Chart
```python
from openpyxl import Workbook
from openpyxl.chart import BarChart, Reference

def add_bar_chart(ws):
    # Create chart
    chart = BarChart()
    chart.type = 'col'
    chart.style = 10
    chart.title = 'Sales Chart'
    chart.y_axis.title = 'Sales'
    chart.x_axis.title = 'Month'
    
    # Data reference
    data = Reference(ws, min_col=2, min_row=1, max_col=3, max_row=6)
    cats = Reference(ws, min_col=1, min_row=2, max_row=6)
    
    # Add data to chart
    chart.add_data(data, titles_from_data=True)
    chart.set_categories(cats)
    chart.shape = 4
    
    # Add chart to sheet
    ws.add_chart(chart, 'E2')
```

### Line Chart
```python
from openpyxl.chart import LineChart, Reference

def add_line_chart(ws):
    chart = LineChart()
    chart.title = 'Trend'
    chart.style = 13
    chart.y_axis.title = 'Value'
    chart.x_axis.title = 'Period'
    
    data = Reference(ws, min_col=2, min_row=1, max_row=5)
    cats = Reference(ws, min_col=1, min_row=2, max_row=5)
    
    chart.add_data(data, titles_from_data=True)
    chart.set_categories(cats)
    
    ws.add_chart(chart, 'E10')
```

### Pie Chart
```python
from openpyxl.chart import PieChart, Reference

def add_pie_chart(ws):
    chart = PieChart()
    chart.title = 'Distribution'
    
    data = Reference(ws, min_col=2, min_row=1, max_row=5)
    cats = Reference(ws, min_col=1, min_row=2, max_row=5)
    
    chart.add_data(data, titles_from_data=True)
    chart.set_categories(cats)
    
    ws.add_chart(chart, 'E2')
```

## Pivot Tables
```python
from openpyxl import Workbook
from openpyxl.utils import get_column_letter

def create_pivot_table(source_ws, pivot_ws):
    # Add data to source
    source_ws['A1'] = 'Category'
    source_ws['B1'] = 'Value'
    source_ws['A2'] = 'A'
    source_ws['B2'] = 100
    # ... more data
    
    # Create pivot table cache
    pivot_cache = pivot_ws.workbook.pivot_caches.create(
        sourceType='Database',
        sourceReference=source_ws
    )
    
    # Create pivot table
    pivot_table = pivot_ws.add_table(
        'A1',
        pivot_cache,
        'PivotTable1'
    )
```

## Conditional Formatting
```python
from openpyxl.formatting.rule import ColorScaleRule, FormulaRule
from openpyxl.styles import PatternFill

def add_conditional_formatting(ws):
    # Color scale (green-yellow-red)
    color_scale = ColorScaleRule(
        start_type='min', start_color='00FF00',
        mid_type='percentile', mid_value=50, mid_color='FFFF00',
        end_type='max', end_color='FF0000'
    )
    ws.conditional_formatting.add('B2:B10', color_scale)
    
    # Formula-based
    formula_rule = FormulaRule(
        formula=['$C2>100'],
        fill=PatternFill(start_color='FF0000', end_color='FF0000', fill_type='solid')
    )
    ws.conditional_formatting.add('A1:A10', formula_rule)
```

## Export Data
```python
from openpyxl import Workbook

def export_to_excel(data, filename, headers):
    wb = Workbook()
    ws = wb.active
    
    # Headers
    for col, header in enumerate(headers, 1):
        ws.cell(row=1, column=col, value=header)
    
    # Data
    for row_idx, row in enumerate(data, start=2):
        for col_idx, value in enumerate(row, start=1):
            ws.cell(row=row_idx, column=col_idx, value=value)
    
    # Auto-adjust column widths
    for column in ws.columns:
        max_length = 0
        column_letter = get_column_letter(column[0].column)
        for cell in column:
            try:
                if len(str(cell.value)) > max_length:
                    max_length = len(str(cell.value))
            except:
                pass
        adjusted_width = min(max_length + 2, 50)
        ws.column_dimensions[column_letter].width = adjusted_width
    
    wb.save(filename)
```

## Related Skills
- pdf: PDF creation
- docx: Word document creation
- pptx: PowerPoint creation
- analytics: Data analysis
- database: Data management