import reportlab.rl_config

from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet

from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from reportlab.platypus import Paragraph, SimpleDocTemplate

import math
import os

from package.pdf_.pdf_enums import TEXT_ALIGNS, DASHES
from package.pdf_.pdf_utils import Utils

class Shapes(Utils):

    #region [Propiedades]: Name-> Varios
    @property
    def fuentes_registradas(self):
        return self.__fuentes_registradas__

    @fuentes_registradas.setter
    def fuentes_registradas(self, value):
        fonts_folder = 'src\\fonts\\'
        for font in value:
            pdfmetrics.registerFont(TTFont(font[0], f'{fonts_folder}{font[0]}.{font[1]}'))


    @property
    def inicia_path(self):
        return self.__inicia_path__

    @inicia_path.setter
    def inicia_path(self, value):
        if value:
            self.path = self.c.beginPath()
            self.x, self.y, y_origin = self._utils_._get_coor_(self.x, None, self.y, None)
            self.path.moveTo(self.x, self.y)
            self.y = y_origin
        else:
            self.path.close()
            self.c.drawPath(self.path)

    @property
    def move_or_draw_path(self):
        return self.__move_path__

    @move_or_draw_path.setter
    def move_or_draw_path(self, value):
        """
        value = True: Mueve el cursor
        value = False: Dibuja la línea
        """
        self.x, self.y, y_origin = self._utils_._get_coor_(self.x, None, self.y, None)
        if value:
            self.path.moveTo(self.x, self.y)
        else:
            self.path.lineTo(self.x, self.y)

        self.y = y_origin

    @property
    def rotar(self):
        return self.__rotar__

    @rotar.setter
    def rotar(self, value):
        self.__rotar__ = value
        self.c.rotate(value)

    @property
    def line_join(self):
        return self.__line_join__

    @line_join.setter
    def line_join(self, value):
        self.__line_join__ = value
        self.c.setLineJoin(value)

    @property
    def dashes(self):
        return self.__dashes__

    @dashes.setter
    def dashes(self, value):
        if value == DASHES.simple_:
            self.c.setDash(6, 3)
        elif value == DASHES.dots_:
            self.c.setDash(1, 2)
        else:
            self.c.setDash([1,1,3,3,1,44,1], 0)


    @property
    def set_stroke_width(self):
        return self.__stroke_width__

    @set_stroke_width.setter
    def set_stroke_width(self, value):
        self.__stroke_width__ = value
        self.c.setLineWidth(value)
    #endregion

    def __init__(self):
        ...

    def create_pdf(self, nombre_archivo, landscape, author, title, subject, with_styles):
        self.c = None
        self._utils_ = Utils(612, 792)
        self.with_styles = with_styles
        self.cust = None
        self.list_xy_wh = None

        self.text_align = TEXT_ALIGNS.izq
        self.x, self.y, self.w, self.h, = (0, 0, 0, 0)

        self.stroke, self.fill, self.stroke_width = (1, 0, None)
        self.name = nombre_archivo
        self.story = []
        #lettr = (612.0, 792.0)

        if self.with_styles:
            self.styles = None
            self.doc = SimpleDocTemplate(nombre_archivo, pagesize=letter)
            # self.c = self.doc.
        else:
            if landscape:
                self.c = canvas.Canvas(nombre_archivo, pagesize=landscape(letter))
            else:
                self.c = canvas.Canvas(nombre_archivo, pagesize=letter)

        self.c.setAuthor(author)
        self.c.setTitle(title)
        self.c.setSubject(subject)

    def close(self):
        if self.with_styles:
            
            story = []

            for s in self.story:
                story.append(Paragraph(s[0], s[1]))

            self.doc.build(self.story)

        else:
            self.c.showPage()
            self.c.save()

    def set_stroke_color(self, color):
        """
        color= 'rgb(r,g,b)' => Nota-> Sin espacios
        color= '#rrggbb'
        color= '#rgb'
        """
        r, g, b, alpha = self._parse_color_(color)
        if self.text_align == TEXT_ALIGNS.cust:
            self.cust.setStrokeColorRGB(r, g, b)
        else:
            self.c.setStrokeColorRGB(r, g, b, alpha=alpha)

    def set_fill_color(self, color):
        """
        color= 'rgb(r,g,b)' => Nota-> Sin espacios
        color= 'rgba(r,g,b,a)' => Nota-> Sin espacios
        color= '#rrggbb'
        color= '#rgb'
        """
        r, g, b, alpha = self._parse_color_(color)
        r, g, b = self._utils_.get_percent(r, g, b)
            
        if self.text_align == TEXT_ALIGNS.cust:
            self.cust.setFillColorRGB(r, g, b)
        else:
            self.c.setFillColorRGB(r, g, b, alpha=alpha)

    def lines(self):
        """
        Recibe una lista con 4 argumentos en cada tupla:
        x1, y1, x2, y2
        """
        if self.list_xy_wh == None:
            print ('Se debe establecer al menos una tupla de coordenadas')
            return 0

        linelist = self._utils_._get_list_coor_(self.list_xy_wh)

        self.c.lines(linelist)

    def rects(self, radius=0):
        """
        Si radius > 0
        hace referencia al borde redondeado
        """
        if self.list_xy_wh == None:
            print ('Se debe establecer al menos una tupla de coordenadas')
            return 0

        self.has_radius = False

        if radius > 0:
            self.has_radius = True
            self.radius = radius

        if not self.has_radius:

            for coor in self.list_xy_wh:
                x, y, y_origin = self._utils_._get_coor_(coor[0], None, coor[1], None)

                self.c.rect(
                    x,
                    y,
                    coor[2],
                    coor[3],
                    stroke=self.stroke,
                    fill=self.fill
                )

        else:

            for coor in self.list_xy_wh:
                x, y, y_origin = self._utils_._get_coor_(coor[0], None, coor[1], None)

                self.c.roundRect(
                    x,
                    y,
                    coor[2],
                    coor[3],
                    self.radius,
                    stroke=self.stroke,
                    fill=self.fill
                )


    def circles(self):
        """
        Recibe una lista de 3 argumentos en cada tupla:
        x, y, r
        """
        if self.list_xy_wh == None:
            print ('Se debe establecer al menos una tupla de coordenadas')
            return 0


        for coor in self.list_xy_wh:
            x, y, y_origin = self._utils_._get_coor_(coor[0], None, coor[1], None)

            self.c.circle(
                x,
                y,
                coor[2],
                stroke=self.stroke,
                fill=self.fill
            )


    def ellipses(self):
        """
        Recibe una lista con 4 argumentos en cada tupla:
        x1, y1, x2, y2
        """
        if self.list_xy_wh == None:
            print ('Se debe establecer al menos una tupla de coordenadas')
            return 0

        ellipselist = self._utils_._get_list_coor_(self.list_xy_wh)

        for coor in ellipselist:

            self.c.ellipse(
                coor[0],
                coor[1],
                coor[2],
                coor[3],
                stroke=self.stroke,
                fill=self.fill
            )

    def super_shape(self, m, n1, n2, n3, alpha, w=10, h=10):
        a, b = (1, 1)

        r = 1
        t1 = math.pow(math.fabs(math.cos((m * alpha) / 4) / a), n2)
        t2 = math.pow(math.fabs(math.sin((m * alpha) / 4) / b), n3)

        r = math.pow(t1 + t2, 1 / n1)

        if math.fabs(r) == 0:
            x = 0
            y = 0
        else:
            r = 1 / r
            x = w * r * math.cos(alpha)
            y = h * r * math.sin(alpha)
        
        return (x, y)



