import argparse
import os

from package.models.example.model import Eventos, Test, Indicadores
from package.sql.params import filters
# from package import Eventos, Test, Indicadores, filters

class AttrDict():pass

#region [Otro]: Name-> App 
class App():

    _initArgs = dict(filters.FILTERS)

    #region [OnInit]: Name-> __init__
    def __init__(self, tipo, filtros, params):
        self.type = tipo
        self.filtros = AttrDict()

        if filtros != None:
            f = 1
            for fil in filtros.split(','):
                v = None
                for k in self._initArgs.keys():
                    if k == fil:
                        v = self._initArgs[k]
                        self.filtros.__dict__[f'filtro{f}'] = v
                        f = f + 1

        if params != None:
            f = 1
            for p in params.split(','):
                self.filtros.__dict__[f'param{f}'] = p
                f = f + 1

        self.get_choice()
    #endregion

    # -*- coding: utf-8 -*- region [Function]: Name-> ejecuta metodo para crear reporte
    def get_choice(self):

        self.DEBUG = os.getenv("DEBUG")
        
        switch = {
            None: self.test,
            'test1': self.test,
            'test2': self.test2,
            'test3': self.test3,
            'test4': self.test4,
        }

        func = switch.get(self.type, '')
        func()
    #endregion

    #region [Function]: Name-> test2
    def test2(self):
        ev = Eventos()
        pdf = ev.create_pdf(pdf_name='Test2', islandscape=True)
        ev.crea_reporte_eventos(pdf=pdf)
    #endregion
    
    #region [Function]: Name-> test3
    def test3(self):
        ev = Eventos()
        pdf = ev.create_pdf(pdf_name='Test3')
        ev.crea_reporte_eventos_table(pdf=pdf)
    #endregion

    #region [Function]: Name-> test4
    def test4(self):
        ind = Indicadores(self.filtros)
        pdf = ind.create_pdf(pdf_name='Test4')
        ind.create_pdf_chart(pdf=pdf)
    #endregion

    #region [Function]: Name-> test    
    def test(self):
        t = Test()
        pdf = t.create_pdf(pdf_name=self.filtros.param1)
        t.create_reporte_test(pdf=pdf)
    #endregion
#endregion
import environ
def main():
    args = argparse.ArgumentParser()
    args.add_argument('-v', '--version', help='Muestra la version del generador de reportes SIRED-CA', action='store_true')
    args.add_argument('-r', '--reporte', help='Solicita la generacion del reporte', action='store_true')
    args.add_argument('type', type=str, nargs='?', help='Indica el tipo de reporte')
    args.add_argument('filters', type=str, nargs='?', help='Filtros a usar para ejecutar el reporte')
    args.add_argument('params', type=str, nargs='?', help='Parametros a usar para ejecutar el reporte')

    args = args.parse_args()
    # Obtener el archivo .env
    root = environ.Path(__file__) - 1  # get root of the project
    # print(root)
    env = environ.Env()
    environ.Env.read_env()

    VERSION = os.getenv('VERSION')
    DEBUG = os.getenv("DEBUG") == 'True'

    if args.version:
        print(VERSION)
    elif args.reporte:
        if DEBUG: print('>> Se solicita el reporte')        
        
        params = None
        if args.params:
            if DEBUG: print('>> Se establecen los parametros')
            params = args.params

        filtros = None
        if args.filters:
            if DEBUG: print('>> Se establece el filtro')
            filtros = args.filters

        tipo = None
        if args.type:
            if DEBUG: print('>> Se establece el tipo')
            tipo = args.type
        
        if DEBUG: print('>> Se ejecuta el reporte')

        # print (tipo, filtros, params)
        app = App(tipo, filtros, params)

    return 0


if __name__ == "__main__":
    main()
