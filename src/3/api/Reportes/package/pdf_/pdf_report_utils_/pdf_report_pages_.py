# from reportlab.lib import enums as align

class Pages():

    def __init__(self, page_size, unidades):
        #Cuando es letter vertical
        #21.59 posiciones en x
        #27.94 posiciones en y
        self.page_size = page_size
        self.font = None
        self.texto = ''
        self.unidades = unidades
        self.__align__ = align.TA_RIGHT_DOWN

    #region [Propiedades]: Name-> align
    @property
    def align(self):
        return self.__align__
    
    @align.setter
    def align(self, value):
        self.__align__ = value
    #endregion

    def right_down(self, canvas, texto):
        canvas.drawRightString(20*self.unidades, 1*self.unidades, texto)
    
    def right_up(self, canvas, texto):
        canvas.drawRightString(20*self.unidades, 27*self.unidades, texto)

    def left_down(self, canvas, texto):
        canvas.drawString(1*self.unidades, 1*self.unidades, texto)

    def left_up(self, canvas, texto):
        canvas.drawString(1*self.unidades, 27*self.unidades, texto)

    def center_down(self, canvas, texto):
        canvas.drawCentredString(10.5*self.unidades, 1*self.unidades, texto)
    
    def center_up(self, canvas, texto):
        canvas.drawCentredString(10.5*self.unidades, 27*self.unidades, texto)

    def add_page_number(self, canvas, doc):
        """
        Add the page number
        """
        page_num = canvas.getPageNumber()
        text = f'{self.texto}{page_num}'

        switch = {
            align.TA_RIGHT_DOWN: self.right_down,
            align.TA_RIGHT_UP: self.right_up,
            align.TA_LEFT_DOWN: self.left_down,
            align.TA_LEFT_UP: self.left_up,
            align.TA_CENTER_DOWN: self.center_down,
            align.TA_CENTER_UP: self.center_up,
        }

        func = switch.get(self.align)

        func(canvas, text)
        