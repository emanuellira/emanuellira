from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.units import cm
from reportlab.lib.styles import ParagraphStyle

from reportlab.platypus import Paragraph, SimpleDocTemplate
from reportlab.platypus.flowables import Spacer
from reportlab.platypus.doctemplate import Indenter, NextPageTemplate
from reportlab_qrcode import QRCodeImage
# from reportlab.lib import enums as TA_consts

from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from .pdf_enums import TA as TA_consts
from .pdf_report_utils_.pdf_report_pages_ import Pages

import qrcode

import environ

class PDFReport():

    __paragraph__ = None
    __qr_code__ = None

    #region [OnInit]: Name-> __init__
    def __init__(self, nombre_archivo, islandscape=False, title=''):

        self.is_landscape = islandscape
        if self.is_landscape:
            self.doc = SimpleDocTemplate(nombre_archivo, pagesize=landscape(letter), title=title, author="SIRED", subject="", creator="SIRED")

        else:
            self.doc = SimpleDocTemplate(nombre_archivo, pagesize=letter, title=title, author="SIRED", subject="", creator="SIRED")

        self.styles = []
        self.extend_style = ParagraphStyle
        self.__story__ = []
        self.__fuentes_registradas__ = []

        self.__current_style__ = None
        self.__indenter__ = (0, 0)
        self.__spacer__ = (0, 0)
        self.__is_with_pages__ = False
        self._cm_ = cm

    #endregion

    #region [Function]: Name-> close
    def close(self):
        assert self.doc != None, 'Primero debes crear un: _ = PDFReport'

        if self.__is_with_pages__:
            self.doc.build(self.__story__, onFirstPage=self.pages.add_page_number, onLaterPages=self.pages.add_page_number)
        else:
            self.doc.build(self.__story__)
    #endregion

    #region [Function]: Name-> add_pages
    def show_pages(self, texto='', align=TA_consts.TA_RIGHT_DOWN):
        self.__is_with_pages__ = True
        if self.is_landscape:
            self.pages = Pages(page_size=landscape(letter), unidades=self._cm_)

        else:
            self.pages = Pages(page_size=letter, unidades=self._cm_)

        self.pages.align = align
    #endregion

    #region [Propiedades]: Name-> is_landscape
    @property
    def is_landscape(self):
        return self.__is_landscape__

    @is_landscape.setter
    def is_landscape(self, value):
        self.__is_landscape__ = value
    #endregion

    #region [Function]: Name-> style_register
    def style_register(self, style=None):
        if style == None:
            return 0

        s = style()
        self.styles.append(s)
    #endregion

    #region [Propiedades]: Name-> fuentes_registradas
    @property
    def fuentes_registradas(self):
        return self.__fuentes_registradas__

    @fuentes_registradas.setter
    def fuentes_registradas(self, value):
        self.__fuentes_registradas__.append(value)
        root = environ.Path(__file__) - 3  # get root of the project
        # print(root)
        fonts_folder =  f'{root}\\fonts\\'
        for font in value:
            pdfmetrics.registerFont(TTFont(font[0], f'{fonts_folder}{font[0]}.{font[1]}'))

    #endregion

    #region [Propiedades]: Name-> font_family
    @property
    def font_family(self):
        return None

    @font_family.setter
    def font_family(self, value):

        assert isinstance(value, tuple) and len(value) == 5, 'Se esperaba una tupla con 5 elementos'

        pdfmetrics.registerFontFamily(
            value[0],
            normal=value[1],
            bold=value[2],
            italic=value[3],
            boldItalic= value[4]
        )
    #endregion

    #region [Propiedades]: Name-> current_style
    @property
    def current_style(self):
        return self.__current_style__

    @current_style.setter
    def current_style(self, value):
        'Agrega el estilo a utilizar'
        self.__current_style__ = value
    #endregion

    #region [Propiedades]: Name-> add_indenter
    @property
    def add_indenter(self):
        return self.__indenter__

    @add_indenter.setter
    def add_indenter(self, value):
        'Agrega una indentación en x y/o y'
        assert isinstance(value, tuple), 'Indenter requiere de una tupla (x, y)'

        self.__story__.append(Indenter(value[0], value[1]))
    #endregion

    #region [Propiedades]: Name-> add_spacer
    @property
    def add_spacer(self):
        return self.__spacer__

    @add_spacer.setter
    def add_spacer(self, value):
        'Agrega un espacio en x y/o y en cm'
        assert isinstance(value, tuple), 'Spacer requiere de una tupla (x, y)'

        self.__story__.append(Spacer(value[0] * self._cm_, value[1] * self._cm_))
    #endregion

    #region [Function]: Name-> add_next_page
    def add_next_page(self, style=None):
        if style == None:
            self.__add_page__ = self.extend_style('salto', pageBreakBefore=1, keepWithNext=1)
        else:
            self.__add_page__ = self.extend_style('salto', parent=style, pageBreakBefore=1, keepWithNext=1)

        self.__story__.append(Paragraph('', self.__add_page__))

        return self.__add_page__
    #endregion

    #region [Function]: Name-> get_paragraph
    def get_paragraph(self, value):
        return Paragraph(value, self.current_style)    
    #endregion
    
    #region [Propiedades]: Name-> qr_code
    @property
    def qr_code(self):
        return self.__qr_code__

    @qr_code.setter
    def qr_code(self, value):
        self.__qr_code__ = QRCodeImage(value)
    #endregion

    #region [Propiedades]: Name-> add_
    @property
    def add_(self):
        return None

    @add_.setter
    def add_(self, value):
        #Es un paragraph
        if isinstance(value, str):
            assert self.current_style != None, 'Debes agregar un estilo'            
            self.__story__.append(Paragraph(value, self.current_style))
        else:
            self.__story__.append(value)
    #endregion
        
