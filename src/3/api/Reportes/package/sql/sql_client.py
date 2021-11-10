import os
import pyodbc

class SQLClient():

    __cn__ = None
    cells = None
    __cells_count__ = 0
    __rows_count__ = 0

    def __init__(self):
        # self.sql_connection()
        ...

    #region [Function]: Name-> Conexión a BD
    def sql_connection(self):
        # try:
        NAME_SIRED = os.getenv('NAME_SIRED')
        USER = os.getenv('USER')
        PSW = os.getenv('PSW')
        DEBUG = os.getenv('DEBUG')
        DATASOURCE = os.getenv('DATASOURCE')
        
        cn = pyodbc.connect('DRIVER={ODBC Driver 17 for SQL Server};'+f'SERVER={DATASOURCE};DATABASE={NAME_SIRED};UID={USER};PWD={PSW}')
        cmd = cn.cursor()

        if DEBUG:
            cmd.execute("SELECT @@version;") 
            row = cmd.fetchone()
            print('>> Conectando a la base de datos...')
            while row: 
                print(f'  {row[0]}')
                row = cmd.fetchone()
        
        return cmd
    #endregion

    @property
    def next_row(self):
        self.cells = self.__cn__.fetchone()
        
        if self.cells:
            self.__cells_count__ = len(self.cells)
            self.__rows_count__ = self.__rows_count__ + 1
            
        return self.cells

    @property
    def cells_count(self):
        return self.__cells_count__
    
    @property
    def rows_count(self):
        return self.__rows_count__

    @property
    def connection(self):
        return self.__cn__

    @connection.setter
    def connection(self, value):
        self.__rows_count__ = 0
        self.__cn__ = value

    @property
    def get_columns(self):
        return [column[0] for column in self.__cn__.description]
        

class select_(object):

    _initArgs = {
        'table_name':None,
        'fields': '*',
        'where': None,
        'group': None,
        'parametros': None
    }

    args = []
    
    def __init__(self, arg):
        self._arg = arg
    
    def __call__(self, cmd, **kw):
        for k in self._initArgs.keys():
            v= None
            if k in kw:
                v = kw[k]            
                self._initArgs[k] = v

            self.args.append(v)

        where = self._initArgs['where']
        where = '' if where == None else f'where {where}'
        fields = self._initArgs['fields']
        table_name = self._initArgs['table_name']
        group = self._initArgs['group']
        group = '' if group == None else f'group by {group}'
        parametros = self._initArgs['parametros']

        assert not table_name == None, 'No puedes consultar sin enviar el nombre de la tabla: table_name'

        if parametros != None:
            cmd.execute(f"SELECT {fields} FROM {table_name} {where} {group}", parametros)
        else:
            cmd.execute(f"SELECT {fields} FROM {table_name}")

        return cmd



