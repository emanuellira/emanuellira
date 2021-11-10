from package.sql import sql_client
from package.models import pdf_model
from package.charts import chart
from package.pdf_.styles import base_
from package.images_ import image
from package.pdf_.pdf_report_tables_.pdf_report_table_ import PDFTable
from package.pdf_.pdf_enums import TA
# from package import sql_client, pdf_model, chart, base_, image, TA, PDFTable

class Indicadores(sql_client.SQLClient):
    #region [OnInit]: Name-> __init__
    def __init__(self, filtros):
        super()
        self.filtros = filtros
        self.connection = self.sql_connection()
    #endregion
    
    #region [Decorator]: Name-> select
    @sql_client.select_
    def select(self, cmd, table_name, fields, where):
        return connection
    #endregion

    #region [Decorator]: Name-> crea_reporte_pdf_
    @pdf_model.crea_reporte_pdf_
    def create_pdf(self, pdf_name, islandscape=False):
        return pdf
    #endregion

    #region [Decorator]: Name-> chart_vertical
    @chart.chart_vertical
    def create_vertical_chart(data, categories):
        return chart
    #endregion

    #region [Decorator]: Name-> chart_line
    @chart.chart_line
    def create_line_chart(data, categories):
        return chart
    #endregion
    
    #region [Decorator]: Name-> chart_line
    @chart.chart_pie
    def create_pie_chart(data, categories):
        return chart
    #endregion

    #region [Decorator]: Name-> load_image
    @image.load_image_
    def load_image(self, img_name):
        return img
    #endregion

    def create_pdf_chart(self, pdf):
        fields=f'{self.filtros.filtro1}, sum({self.filtros.filtro2}) as Total'
        self.connection = self.select(cmd=self.connection, table_name='[Diagnosticos_Pre]', \
            fields=fields, where=f'{self.filtros.filtro3}=?', parametros=self.filtros.param1, group=self.filtros.filtro1)
        
        columns = self.get_columns

        self.__ = pdf

        self.__.current_style = self.__.styles[0].Normal
        self.__.add_ = f'{columns[0]} - {columns[1]}'

        categories = []
        data = []
        while self.next_row:
            categories.append(self.cells[0])
            data.append(self.cells[1])
            # Para ejemplificar el line_plot
            # data.append((self.cells[1],self.cells[1]))

        # chart = self.create_vertica_chart([data], categories=categories)
        # chart = self.create_line_chart([data], categories=categories)
        # chart = self.create_line_chart([data], categories=categories, is_line_plot=True)
        chart = self.create_pie_chart([data], categories=categories)
        self.__.add_ = chart

        sarc_img = self.load_image(img_name='sarc')
        self.__.add_ = sarc_img

        self.__.close()

class Eventos(sql_client.SQLClient):

    def __init__(self):

        super()
        #rows count = 0, solo hace la conexión
        self.connection = self.sql_connection()


    @sql_client.select_
    def select(self, cmd, table_name, fields, where):
        """
        Se conecta a la base de datos y regresa la consulta:
        table_name = [Nombre de la tabla a consultar]
        fields = *  -> por default
        where = None -> por default, ejemplo id = 1
        """
        return rows

    @pdf_model.crea_reporte_pdf_
    def create_pdf(self, pdf_name, islandscape=False):
        """
        Localiza la ruta donde se genera el reporte, crea el pdf y
        regresa el objeto listo para ser trabajado
        """
        return pdf

    def agregar_titulo(self, texto):
        # Estilos y extendiendo el title
        title = self.__.extend_style('title', parent=self.styles.Title, textColor=base_._danger_)
        # Agregando título y aplicando estilo tipo título
        self.__.current_style = title
        self.__.add_ = texto

    def agregar_columnas(self):
        # Obteniendo nombre de las columnas
        columns = [column[0] for column in self.connection.description]
        # Centrar texto de los nombres de columna
        bold = self.__.extend_style('bold', parent=self.styles.CenterText, textColor=base_._light_xl_)
        self.__.current_style = bold
        # Crear estilo para los nombres de las columnas
        # además crea un paragraph para agregarlo a la tabla
        f_cve = self.__.get_paragraph(f'<b>{columns[0]}</b>')
        f_nombre = self.__.get_paragraph(f'<b>{columns[1]}</b>')

        return (f_cve, f_nombre)
        

    #region [Function]: Name-> crear reporte con tabla
    def crea_reporte_eventos_table(self, pdf=None):
        # Nota-> Nombre de la tabla
        table_name = 'Departamentos'

        # Nota-> Realizando consulta
        self.connection = self.select(cmd=self.connection, table_name=table_name, fields='CVE, NOMBRE')

        self.__ = pdf
        self.styles = pdf.styles[0]
        self.agregar_titulo(table_name)

        # Nota-> Creando Tabla
        table = PDFTable()

        # Nota-> Agregar los nombres de las columnas        
        pdf_column = table._new_()        
        pdf_column.add_cells(self.agregar_columnas())
        table._set_(pdf_column)

        # Nota-> Datos de la consulta
        while self.next_row:
            data = [cell for cell in self.cells]

            pdf_row = table._new_()
            pdf_row.add_cells(data)
            table._set_(pdf_row)

        #Aplicar estilos, después de generar la tabla
        table._width_ = (
            self.cells_count*[5*pdf._cm_],
            (self.rows_count + 1)*[1*pdf._cm_]
        )

        # Nota-> Estilos a toda la tabla
        table._style_ = (TA.TA_tc, (0,0), (-1,-1), base_._secondary_)
        table._style_ = (TA.TA_box, (0,0), (-1,-1), 1, base_._dark_)
        table._style_ = (TA.TA_innerg, (0, 0), (-1, -1), 0.25, base_._light_)
        
        # Nota-> Estilos unicamente al encabezado
        # En el caso del encabezado, por lógica se añade el estilo despúes o
        # será sustituido por los demás estilos
        table._style_ = (TA.TA_bg, (0, 0), (-1, 0), base_._primary_)
        table._style_ = (TA.TA_valign, (0, 0), (-1, 0), base_._middle_)
        
        # Nota-> Agregar tabla al pdf
        self.__.add_ = table._tabla_

        # Nota-> Cerrar y crear pdf
        self.__.close()

    #endregion

    #region [Function]: Name-> crea reporte con 1 evento y en horizontal
    def crea_reporte_eventos(self, pdf=None):
        """
        Se conecta a la base de datos y crea un reporte con el primer
        elemento de la consulta, adicional, agregar un qrcode
        """
        table_name = 'Eventos'
        self.__ = pdf
        fields = '[IDEvento],[Fenomeno],[Nombre],[FechaEvento],[FechaCreacion],[FechaModificacion],[Eliminado],[Autoriza]'
        self.connection = self.select(table_name=table_name, cmd=self.connection, where='idEvento=?', fields=fields, parametros=(1,))
        
        self.__.add_spacer = (0, 0.5)
        self.styles = self.__.styles[0]

        # Nota-> Nombres de las columnas
        columns = [column[0] for column in self.connection.description]

        # Nota-> Solamente toma el primer elemento y lo agrega al pdf
        cells = self.next_row
        
        self.agregar_titulo(table_name)

        self.__.current_style = self.styles.BodyText
        for index in range(8):
            self.__.add_ = f'<b>{columns[index]}:</b> {cells[index]}'

        self.__.qr_code = 'Este es un ejemplo'
        self.__.add_ = self.__.qr_code

        self.__.close()
    #endregion

class Test():
    def __init__(self):
        ...

    @pdf_model.crea_reporte_pdf_
    def create_pdf(self, pdf_name=None):
        return pdf

    def create_reporte_test(self, pdf=None):
        "Crea un reporte de prueba multiplicando la palabra bla 150 veces"
        self.__ = pdf
        self.__.add_spacer = (0, 0.5)
        styles = self.__.styles[0]
        self.__.current_style = styles.BodyText
        self.__.add_ = f''' <font color="{base_._dark_}"><b>bla</b></font> bla <font color="{base_._primary_}"><i>bla</i></font>''' * 150

        self.__.close()