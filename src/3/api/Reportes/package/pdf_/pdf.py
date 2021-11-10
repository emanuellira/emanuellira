
from package.pdf_.pdf_shapes import Shapes
from package.pdf_.pdf_enums import TEXT_ALIGNS

class PDF(Shapes):

    @property
    def inicia(self):
        return self.__inicia__
    
    @inicia.setter
    def inicia(self, value):
        self.__inicia__ = value
        if value:
            self.cust = self.c.beginText()
            self.x, self.y, y_origin = self._utils_._get_coor_(self.x, None, self.y, None)
            self.cust.setTextOrigin(self.x, self.y)
        else:
            self.c.drawText(self.cust)

    @property
    def font(self):
        return self.__font__

    @font.setter
    def font(self, value):

        self.__font__ = value
        if self.text_align == TEXT_ALIGNS.cust:
            assert self.cust != None, 'Tal vez no has iniciado el write'
            self.cust.setFont(value[0], value[1])
        else:
            self.c.setFont(value[0], value[1])

    @property
    def cursor(self):
        return self.__cursor__

    @cursor.setter
    def cursor(self, value):
        self.__cursor__ = value
        self.cust.moveCursor(value[0], value[1])

    @property
    def char_space(self):
        return self.__char_space__

    @char_space.setter
    def char_space(self, value):
        self.__char_space__ = value
        self.cust.setCharSpace(value)

    @property
    def word_space(self):
        return self.__word_space__

    @word_space.setter
    def word_space(self, value):
        self.__word_space__ = value        
        self.cust.setWordSpace(value)

    @property
    def horizontal_scale(self):
        return self.__horizontal_scale__

    @horizontal_scale.setter
    def horizontal_scale(self, value):
        self.__horizontal_scale__ = value
        self.cust.setHorizScale(value)

    @property
    def inter_line_spacing(self):
        return self.__inter_line_spacing__

    @inter_line_spacing.setter
    def inter_line_spacing(self, value):
        self.__inter_line_spacing__ = value
        self.cust.setLeading(value)


    def __init__(self,
        nombre_archivo,
        landscape=False,
        author='',
        title='',
        subject='',
        with_styles=False):
        super()

        self.create_pdf(nombre_archivo, landscape, author, title, subject, with_styles)

        self.__inicia__ = False
        self.__font__ = None
        self.__cursor__ = None
        self.__char_space__ = 0
        self.__word_space__ = 0
        self.__horizontal_scale__ = 100
        self.__inter_line_spacing__ = 10
        self.__rise_lower__ = None

    def __write_izq__(self, texto):
        self.c.drawString(self.x, self.y, texto)

    def __write_cen__(self, texto):
        self.c.drawCentredString(self.x, self.y, texto)

    def __write_der__(self, texto):
        self.c.drawRightString(self.x, self.y, texto)

    def __write__(self, texto, x, y):
        self.x, self.y, y_origin = self._utils_._get_coor_(self.x, x, self.y, y)

        switch = {
            TEXT_ALIGNS.izq: self.__write_izq__,
            TEXT_ALIGNS.cen: self.__write_cen__,
            TEXT_ALIGNS.der: self.__write_der__
        }
        func = switch.get(self.text_align, '')
        func(texto)

        self.y = y_origin

    def write(self, texto, x=None, y=None, new_line='01', rise=None):
        """
        new_line funciona cuando text_align = cust
        Se debe anteceder con inicia = True y terminar con end=True
        Nota-> Combinaciones: 
        '00' -> Sin salto de línea
        '01' -> Nueva línea (default)
        '10' -> <Combinación aún sin usar>
        '11' -> Nueva línea con múltiples líneas (triple comilla simple)
        """
        if self.text_align == TEXT_ALIGNS.cust:
            self.__write_cust__(texto, new_line, rise)

        else:
            self.__write__(texto, x, y)


    def __write_00__(self, texto):
        self.cust.textOut(texto)

    def __write_01__(self, texto):
        self.cust.textLine(texto)

    def __write_10__(self, texto):
        ...

    def __write_11__(self, texto):
        self.cust.textLines(texto)

    def __write_cust__(self, texto, new_line, rise):
        switch = {
            '00': self.__write_00__,
            '01': self.__write_01__,
            '10': self.__write_10__,
            '11': self.__write_11__
        }

        func = switch.get(new_line, '')

        if rise != None:
            self.cust.setRise(rise)
            
        func(texto)

        self.cust.setRise(0)


    def get_fonts(self):
        return self.c.getAvailableFonts()

    
