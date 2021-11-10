class PDFCell():
    
    #region [OnInit]: Name-> __init__
    def __init__(self, row, col):
        self.__row__ = row
        self.__col__ = col
    #endregion

    #region [Propiedades]: Name-> row y col
    @property
    def row(self):
        return self.__row__

    @property
    def col(self):
        return self.__col__
    #endregion

    #region [Propiedades]: Name-> data
    @property
    def data(self):
        return self.__data__

    @data.setter
    def data(self, value):
        self.__data__ = value
    #endregion