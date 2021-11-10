from reportlab.lib.styles import ParagraphStyle, StyleSheet1, ListStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER

#Grises
_light_xl_ = '#EBEEEF'
_light_ = '#C9CCCF'
_dark_ = '#1D1E20'

#Sarc
_primary_ = '#21548B'
_success_ = '#9EC346'
_secondary_ = '#4B4F54'
_info_ = '#8BB6E4'

#Secundarios
_danger_ = '#DC2E2E'
_warning_l_ = '#DD6E42'
_warning_ = '#F7CD50'

#Align
_center_ = 'CENTER'
_middle_ = 'MIDDLE'
_right_ = 'RIGHT'
_left_ = 'LEFT'

_baseFontName = 'Montserrat-Light'
_baseFontNameBI = 'Montserrat-Bold'
_baseFontNameI = 'Montserrat-Light-Italic'
_baseFontNameB = 'Montserrat-Bold'

def get_base_style_sheet():
    """Returns a stylesheet object"""
    stylesheet = StyleSheet1()

    stylesheet.add(ParagraphStyle(name='Normal',
                                  fontName=_baseFontName,
                                  fontSize=10,
                                  leading=12)
                   )

    stylesheet.add(ParagraphStyle(name='BodyText',
                                  parent=stylesheet['Normal'],
                                  spaceBefore=6)
                   )
    stylesheet.add(ParagraphStyle(name='CenterText',
                                  parent=stylesheet['Normal'],
                                  spaceBefore=6,
                                  alignment=TA_CENTER)
                   )
    stylesheet.add(ParagraphStyle(name='Italic',
                                  parent=stylesheet['BodyText'],
                                  fontName = _baseFontNameI)
                   )                   

    stylesheet.add(ParagraphStyle(name='Heading1',
                                  parent=stylesheet['Normal'],
                                  fontName = _baseFontNameB,
                                  fontSize=18,
                                  leading=22,
                                  spaceAfter=6),
                   alias='h1')

    stylesheet.add(ParagraphStyle(name='Title',
                                  parent=stylesheet['Normal'],
                                  fontName = _baseFontNameB,
                                  fontSize=18,
                                  leading=22,
                                  alignment=TA_CENTER,
                                  spaceAfter=6),
                   alias='title')

    stylesheet.add(ParagraphStyle(name='Heading2',
                                  parent=stylesheet['Normal'],
                                  fontName = _baseFontNameB,
                                  fontSize=14,
                                  leading=18,
                                  spaceBefore=12,
                                  spaceAfter=6),
                   alias='h2')

    stylesheet.add(ParagraphStyle(name='Heading3',
                                  parent=stylesheet['Normal'],
                                  fontName = _baseFontNameBI,
                                  fontSize=12,
                                  leading=14,
                                  spaceBefore=12,
                                  spaceAfter=6),
                   alias='h3')

    stylesheet.add(ParagraphStyle(name='Heading4',
                                  parent=stylesheet['Normal'],
                                  fontName = _baseFontNameBI,
                                  fontSize=10,
                                  leading=12,
                                  spaceBefore=10,
                                  spaceAfter=4),
                   alias='h4')
                   
    stylesheet.add(ParagraphStyle(name='Heading5',
                                  parent=stylesheet['Normal'],
                                  fontName = _baseFontNameB,
                                  fontSize=9,
                                  leading=10.8,
                                  spaceBefore=8,
                                  spaceAfter=4),
                   alias='h5')

    stylesheet.add(ParagraphStyle(name='Heading6',
                                  parent=stylesheet['Normal'],
                                  fontName = _baseFontNameB,
                                  fontSize=7,
                                  leading=8.4,
                                  spaceBefore=6,
                                  spaceAfter=2),
                   alias='h6')

    stylesheet.add(ParagraphStyle(name='Bullet',
                                  parent=stylesheet['Normal'],
                                  firstLineIndent=0,
                                  spaceBefore=3),
                   alias='bu')

    stylesheet.add(ParagraphStyle(name='Definition',
                                  parent=stylesheet['Normal'],
                                  firstLineIndent=0,
                                  leftIndent=36,
                                  bulletIndent=0,
                                  spaceBefore=6,
                                  bulletFontName=_baseFontNameBI),
                   alias='df')
                   
    stylesheet.add(ParagraphStyle(name='Code',
                                  parent=stylesheet['Normal'],
                                  fontName='Courier',
                                  fontSize=8,
                                  leading=8.8,
                                  firstLineIndent=0,
                                  leftIndent=36,
                                  hyphenationLang=''))

    stylesheet.add(ListStyle(name='UnorderedList',
                                parent=None,
                                leftIndent=18,
                                rightIndent=0,
                                bulletAlign='left',
                                bulletType='1',
                                bulletColor=_dark_,
                                bulletFontName='Helvetica',
                                bulletFontSize=12,
                                bulletOffsetY=0,
                                bulletDedent='auto',
                                bulletDir='ltr',
                                bulletFormat=None,
                                #start='circle square blackstar sparkle disc diamond'.split(),
                                start=None,
                            ),
                   alias='ul')

    stylesheet.add(ListStyle(name='OrderedList',
                                parent=None,
                                leftIndent=18,
                                rightIndent=0,
                                bulletAlign='left',
                                bulletType='1',
                                bulletColor=_dark_,
                                bulletFontName='Helvetica',
                                bulletFontSize=12,
                                bulletOffsetY=0,
                                bulletDedent='auto',
                                bulletDir='ltr',
                                bulletFormat=None,
                                #start='1 a A i I'.split(),
                                start=None,
                            ),
                   alias='ol')
    return stylesheet

class StyleBase():
    @property
    def Normal(self):
        return get_base_style_sheet()['Normal']
    
    @property
    def BodyText(self):
        return get_base_style_sheet()['BodyText']
    
    @property
    def CenterText(self):
        return get_base_style_sheet()['CenterText']

    @property
    def Italic(self):
        return get_base_style_sheet()['Italic']
    
    @property
    def Heading1(self):
        return get_base_style_sheet()['Heading1']
    
    @property
    def Title(self):
        return get_base_style_sheet()['Title']
    
    @property
    def Heading2(self):
        return get_base_style_sheet()['Heading2']
        
    @property
    def Heading3(self):
        return get_base_style_sheet()['Heading3']

    @property
    def Heading4(self):
        return get_base_style_sheet()['Heading4']

    @property
    def Heading5(self):
        return get_base_style_sheet()['Heading5']

    @property
    def Heading6(self):
        return get_base_style_sheet()['Heading6']

    @property
    def Bullet(self):
        return get_base_style_sheet()['Bullet']

    @property
    def Definition(self):
        return get_base_style_sheet()['Definition']
    
    @property
    def Code(self):
        return get_base_style_sheet()['Code']
    
    @property
    def UnorderedList(self):
        return get_base_style_sheet()['UnorderedList']
    
    @property
    def OrderedList(self):
        return get_base_style_sheet()['OrderedList']