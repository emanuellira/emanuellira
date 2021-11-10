from package.pdf_.pdf_report_tables_.pdf_report_cell_ import PDFCell

class PDFRow():
    
    #region [OnInit]: Name-> __init__
    def __init__(self, row):
        self.__item__ = []
        self.__row__ = row
        self.__col__ = 0
    #endregion

    
    def get_cell(self, row, col):
        return self.__item__
    
    def get(self):
        return self.__item__

    def add_cells(self, cells=('',)):

        for data in cells:
            self.__col__ = self.__col__ + 1
            cell = PDFCell(row=self.__row__, col=self.__col__)
            cell.data = data
            self.__item__.append(cell)
