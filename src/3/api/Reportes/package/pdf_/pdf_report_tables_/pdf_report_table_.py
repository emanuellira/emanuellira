from reportlab.platypus import Table, TableStyle
from package.pdf_.pdf_report_tables_.pdf_report_col_row_ import PDFRow
import numpy as np

class PDFTable():

    # region [OnInit]: Name-> __init__
    def __init__(self, is_row=True):        
        self.__tabla__ = []
        self.__styles__ = []
        self.__width__ = None
        self.__col__ = -1
        self.__row__ = -1

        self.__length_row__ = 0
        self.__length_col__ = 0

        self.is_row = is_row
    # endregion
    
    def _new_(self):
        self.__row__ = self.__row__ + 1
        return PDFRow(self.__row__)

    def _set_(self, item):
        self.__tabla__.append(item)

    #region [Propiedades]: Name-> _style_
    @property
    def _style_(self):
        return self.__styles__

    @_style_.setter
    def _style_(self, value):
        assert isinstance(value, tuple), '_style_ espera una tupla'
        # assert len(value) >= 4 and value[0]=='SPAN', '_style_ debe ser una tupla de 4 ó más elementos'
        self.__styles__.append(value)
    #endregion

    #region [Propiedades]: Name-> width
    @property
    def _width_(self):
        return self.__width__

    @_width_.setter
    def _width_(self, value):
        self.__width__ = value
    #endregion

    #region [Propiedades]: Name-> length_row and length_col
    @property
    def length_row(self):
        return self.__length_row__

    @property
    def length_col(self):
        return self.__length_col__
    #endregion

    @property
    def _tabla_(self):
        data = []
        
        if self.is_row:
            for items in self.__tabla__:
                row = []
                self.__length_row__ = self.__length_row__ + 1
                for item in items.get():
                    self.__length_col__ = self.__length_col__ + 1
                    row.append(item.data)

                data.append(row)
        #--------------------------------------------------------
        else:
            for items in self.__tabla__:
                row = []
                self.__length_row__ = self.__length_row__ + 1
                for item in items.get():
                    self.__length_col__ = self.__length_col__ + 1
                    row.append(item.data)

                data.append(row)
                
            data_aux_ = np.array(data)
            data = []
            for ds in data_aux_.T:
                aux = []
                for d in ds:
                    aux.append(d)

                data.append(aux)
        #------------------------------------------------------
        if self._width_ == None:
            tabla = Table(data)
        else:
            tabla = Table(data, self._width_[0], self._width_[1])

        tabla.setStyle(TableStyle(self._style_))

        return tabla

