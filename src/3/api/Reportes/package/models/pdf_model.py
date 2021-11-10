import os
from package.pdf_.pdf_report_ import PDFReport
from package.pdf_.styles import base_
import environ
class crea_reporte_pdf_():

    _initArgs = {
        'title':None,
        'author':None,
        'subject':None,
        'creator':None,
        'producer': None,
        'islandscape': False,
        'keywords':[],
    }

    args = []

    #region [OnInit]: Name-> __init__
    def __init__(self, pdf_name):
        self.pdf_name = pdf_name
    #endregion

    def __call__(self, pdf_name, **kw):
        for k in self._initArgs.keys():
            v = None
            if k in kw:
                v = kw[k]            
                self._initArgs[k] = v

            self.args.append(v)
        
        root_len = 5    
        DEBUG = os.getenv("DEBUG") == 'True'
        if DEBUG:
            root_len = 6

        root = environ.Path(__file__) - root_len  # get root of the project
        print(root, root_len, DEBUG)
        # fonts_folder =  f'{root}\\fonts\\'
        path =  f'{root}\\assets\\reportesPDF' #path.replace('3\\api\\Reportes\\package\\models\\pdf_model.py', 'assets\\reportesPDF')
        pdf = PDFReport(f'{path}\\{pdf_name}.pdf', title=self._initArgs['title'], islandscape=self._initArgs['islandscape'])
        pdf.style_register(base_.StyleBase)

        fonts = [
            (base_._baseFontName, 'ttf'),
            ('Montserrat-Medium', 'ttf'),
            ('Montserrat-Regular', 'ttf'),
            (base_._baseFontNameB, 'ttf'),
            (base_._baseFontNameI, 'ttf')
        ]

        pdf.fuentes_registradas = fonts
        pdf.font_family = ('Montserrat', base_._baseFontName, base_._baseFontNameB, base_._baseFontNameI, base_._baseFontNameBI)
        
        return pdf
