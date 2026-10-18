from pathlib import Path
import re
from xml.sax.saxutils import escape
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle, Flowable
from reportlab.platypus.tableofcontents import TableOfContents
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / 'output/pdf/Readlr_Ten_Book_Curriculum_Blueprint.pdf'
OUT.parent.mkdir(parents=True, exist_ok=True)
SOURCE = ROOT / 'docs/refactoring/READLR_TEN_BOOK_BLUEPRINT_2026-10-17.md'
TEAL = colors.HexColor('#126b66')
INK = colors.HexColor('#243b45')
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='BodyCustom', fontName='Helvetica', fontSize=9.3, leading=14, textColor=INK, spaceAfter=7))
styles.add(ParagraphStyle(name='H1Custom', fontName='Helvetica-Bold', fontSize=18, leading=23, textColor=TEAL, spaceBefore=10, spaceAfter=14, keepWithNext=True))
styles.add(ParagraphStyle(name='H2Custom', fontName='Helvetica-Bold', fontSize=12.5, leading=17, textColor=TEAL, spaceBefore=14, spaceAfter=8, keepWithNext=True))
styles.add(ParagraphStyle(name='Cell', parent=styles['BodyCustom'], fontSize=8, leading=11, spaceAfter=0))
styles.add(ParagraphStyle(name='CellHead', parent=styles['Cell'], fontName='Helvetica-Bold', textColor=colors.white))
styles.add(ParagraphStyle(name='Cover', fontName='Helvetica-Bold', fontSize=34, leading=40, textColor=TEAL, spaceAfter=22))
styles.add(ParagraphStyle(name='Sub', fontName='Helvetica', fontSize=17, leading=24, textColor=INK, spaceAfter=20))
styles.add(ParagraphStyle(name='TOCcustom', fontName='Helvetica', fontSize=10, leading=17, leftIndent=0, firstLineIndent=0, spaceBefore=7, textColor=INK))

def inline(s):
    s = escape(s)
    s = s.replace('&lt;br/&gt;', '<br/>')
    s = re.sub(r'\[([^\]]+)\]\((https?://[^)]+)\)', r'<link href="\2" color="#126b66">\1</link>', s)
    s = re.sub(r'\*\*(.+?)\*\*', r'<b>\1</b>', s)
    s = re.sub(r'`([^`]+)`', r'\1', s)
    return s

def para(s, style='BodyCustom'):
    return Paragraph(inline(s), styles[style])

class FlowDiagram(Flowable):
    def __init__(self):
        Flowable.__init__(self)
        self.width = 499
        self.height = 325
    def draw(self):
        c = self.canv
        def box(x,y,w,label, fill='#e6f3ef'):
            c.setFillColor(colors.HexColor(fill)); c.setStrokeColor(TEAL)
            c.roundRect(x,y,w,34,5,fill=1,stroke=1)
            c.setFillColor(INK); c.setFont('Helvetica-Bold',8.4)
            c.drawCentredString(x+w/2,y+13,label)
        def arrow(x1,y1,x2,y2):
            c.setStrokeColor(TEAL); c.setLineWidth(1.2); c.line(x1,y1,x2,y2)
            c.line(x2,y2,x2-3,y2+5); c.line(x2,y2,x2+3,y2+5)
        box(145,282,210,'Welcome and readiness')
        arrow(250,282,250,264)
        box(145,230,210,'Reading World')
        box(0,178,145,'Camp / Sound Library')
        box(174,178,151,'Books 1-10')
        box(355,178,144,'Stickers / Passport')
        for x in [72,250,427]:
            c.line(250,230,x,218); arrow(x,218,x,212)
        arrow(250,178,250,160)
        box(75,126,350,'Model -> Guided game -> Fewer clues', '#fff3cf')
        arrow(250,126,250,108)
        box(75,74,350,'Independent application + skill evidence', '#fff3cf')
        arrow(250,74,250,56)
        box(75,22,350,'Next unit / Later revisit / Targeted Camp support')
        c.setFont('Helvetica',8); c.setFillColor(INK)
        c.drawCentredString(250,3,'Tutor oversight and scheduled check-ins support the whole journey.')

class Doc(SimpleDocTemplate):
    def afterFlowable(self, f):
        if isinstance(f, Paragraph) and f.style.name == 'H1Custom':
            text = f.getPlainText()
            key = 'section-' + str(self.seq.nextf('heading'))
            self.canv.bookmarkPage(key)
            self.canv.addOutlineEntry(text,key,0,False)
            self.notify('TOCEntry',(0,text,self.page,key))

def footer(c,d):
    if d.page == 1:
        return
    c.setStrokeColor(colors.HexColor('#c5dcd6')); c.line(48,40,A4[0]-48,40)
    c.setFont('Helvetica',8); c.setFillColor(TEAL)
    c.drawString(48,27,'READLR  |  Curriculum and system blueprint  |  Proposed')
    c.drawRightString(A4[0]-48,27,str(d.page))

story = [Spacer(1,85), para('READLR','Cover'), para('The Reading Chronicles','Sub'),
         para('Ten-book curriculum<br/>and system blueprint','Cover'), Spacer(1,24),
         para('Group review edition 1.1 | 17 October 2026','Sub'),
         para('Learning Camp, curriculum progression, games, reading evidence, proposal changes and evaluation goals.'),
         Spacer(1,30),para('DESIGN STATUS','H2Custom'),
         para('Proposed structure based on the supplied English KS1 materials. Book 1 is partially implemented; this document does not claim that all ten books or assessments are complete.'),
         PageBreak(),para('Contents','H2Custom')]
toc = TableOfContents(); toc.levelStyles=[styles['TOCcustom']]
story += [toc, PageBreak()]
lines = SOURCE.read_text(encoding='utf-8').splitlines()
i = 1
while i < len(lines):
    s=lines[i].strip()
    if not s:
        i+=1; continue
    if s.startswith('```'):
        i+=1
        while i<len(lines) and not lines[i].startswith('```'): i+=1
        story += [Spacer(1,8),FlowDiagram(),Spacer(1,10)]
        i+=1; continue
    if s.startswith('## '):
        if story and not isinstance(story[-1],PageBreak): story.append(PageBreak())
        story.append(para(s[3:],'H1Custom')); i+=1; continue
    if s.startswith('### '):
        if s.startswith('### Book '): story.append(PageBreak())
        story.append(para(s[4:],'H2Custom')); i+=1; continue
    if s.startswith('|'):
        rows=[]
        while i<len(lines) and lines[i].strip().startswith('|'):
            vals=[v.strip() for v in lines[i].strip().strip('|').split('|')]
            if not all(re.fullmatch(r'[-: ]+',v) for v in vals): rows.append(vals)
            i+=1
        n=len(rows[0]); widths={3:[112,188,199],4:[36,151,141,171],5:[95,115,90,100,99]}.get(n,[499/n]*n)
        if n==4: widths=[105,120,135,139]
        cells=[[para(v,'CellHead' if r==0 else 'Cell') for v in row] for r,row in enumerate(rows)]
        table=Table(cells,colWidths=widths,repeatRows=1,hAlign='LEFT')
        table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),TEAL),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),7),('RIGHTPADDING',(0,0),(-1,-1),7),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),('ROWBACKGROUNDS',(0,1),(-1,-1),[colors.HexColor('#eff6f3'),colors.white]),('LINEBELOW',(0,1),(-1,-1),0.3,colors.HexColor('#d5e4de'))]))
        story += [table,Spacer(1,12)]; continue
    if s.startswith('- '):
        story.append(para('- '+s[2:])); i+=1; continue
    story.append(para(s)); i+=1

doc=Doc(str(OUT),pagesize=A4,rightMargin=48,leftMargin=48,topMargin=45,bottomMargin=56,title='Readlr: Ten-Book Curriculum and System Blueprint',author='Readlr project | Group review blueprint')
doc.multiBuild(story,onFirstPage=footer,onLaterPages=footer)
print(OUT)
