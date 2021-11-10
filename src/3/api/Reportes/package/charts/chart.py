from reportlab.graphics.shapes import Drawing
from reportlab.graphics.charts import barcharts, linecharts, lineplots, piecharts, legends
from reportlab.graphics.widgets import markers
from reportlab.lib.validators import Auto
from reportlab.lib.colors import HexColor
from package.pdf_.styles import base_
import math

class chart_vertical(object):

    #region [Propiedades]: Name-> 
    _initArgs = {
        'x': 50,
        'y': 50,
        'height': 125,
        'width': 300,
        'data': [],
        'stroke_color': HexColor(base_._dark_),
        'categories': []
    }

    # args = []
    #endregion

    #region [OnInit]: Name-> __init__
    def __init__(self, arg):
        self._arg = arg
    #endregion

    #region [Function]: Name-> __call__
    def __call__(self, data, **kw):

        for k in self._initArgs.keys():
            v= None
            if k in kw:
                v = kw[k]            
                self._initArgs[k] = v

        assert len(data) > 0, 'La data no puede ir vacía'

        v = barcharts.VerticalBarChart()
        v.x = self._initArgs['x']
        v.y = self._initArgs['y']
        v.height = self._initArgs['height']
        v.width = self._initArgs['width']
        v.data = data
        v.strokeColor = self._initArgs['stroke_color']

        v.valueAxis._valueMin = 0
        v.valueAxis._valueMax = 50
        v.valueAxis._valueStep = 10

        v.categoryAxis.labels.boxAnchor = 'ne'
        v.categoryAxis.labels.dx = 8
        v.categoryAxis.labels.dy = -2
        v.categoryAxis.labels.angle = 30
        v.categoryAxis.categoryNames = self._initArgs['categories']

        drawing = Drawing(400, 200)
        drawing.add(v)

        return drawing
    #endregion

class chart_pie(object):

    #region [Propiedades]: Name-> 
    _initArgs = {
        'x': 65,
        'y': 15,
        'height': 70,
        'width': 70,
        'data': [],
        'stroke_color': HexColor(base_._dark_),
        'categories': []
    }

    # args = []
    #endregion

    #region [OnInit]: Name-> __init__
    def __init__(self, arg):
        self._arg = arg
    #endregion

    #region [Function]: Name-> __call__
    def __call__(self, data, **kw):

        for k in self._initArgs.keys():
            v= None
            if k in kw:
                v = kw[k]            
                self._initArgs[k] = v

        assert len(data) > 0, 'La data no puede ir vacía'

        c = piecharts.Pie()
        c.x = self._initArgs['x']
        c.y = self._initArgs['y']
        c.height = self._initArgs['height']
        c.width = self._initArgs['width']
        ndata = data[0]
        suma = sum(ndata)
        for index in range(0, len(data[0])):
            # sum -> 100%
            # ndata -> ? -> ndata * 100 / sum
            cat = self._initArgs['categories'][index]
            self._initArgs['categories'][index] = f'{cat}: {round((ndata[index] * 100) / suma, 2)}%'
            
        c.labels = self._initArgs['categories']
        c.data = ndata

        c.strokeColor = self._initArgs['stroke_color']

        c.sideLabels = True
        c.slices.strokeWidth = 0.5

        # legend = legends.Legend()
        # legend.alignment = 'right'
        # legend.x = 10
        # legend.y = c.y + 70
        # legend.colorNamePairs = Auto(obj=c)

        drawing = Drawing(400, 200)
        drawing.add(c)
        # drawing.add(legend)

        return drawing
    #endregion

class chart_line(object):

    #region [Propiedades]: Name-> 
    _initArgs = {
        'x': 50,
        'y': 50,
        'height': 125,
        'width': 300,
        'data': [],
        'stroke_color': HexColor(base_._dark_),
        'categories': [],
        'is_line_plot': False
    }

    # args = []
    #endregion

    #region [OnInit]: Name-> __init__
    def __init__(self, arg):
        self._arg = arg
    #endregion

    #region [Function]: Name-> __call__
    def __call__(self, data, **kw):

        for k in self._initArgs.keys():
            v= None
            if k in kw:
                v = kw[k]            
                self._initArgs[k] = v

        assert len(data) > 0, 'La data no puede ir vacía'

        if self._initArgs['is_line_plot']:
            c = lineplots.LinePlot()
            c.lines[0].symbol = markers.makeMarker('FilledCircle')
            # c.lines[1].symbol = makeMarker('Circle'
            c.xValueAxis._valueMin = 0
            c.xValueAxis._valueMax = 5
            c.xValueAxis._valueSteps = [1, 2, 2.5, 3, 4, 5]
            c.xValueAxis.labelTextFormat = '%2.1f'
            c.yValueAxis._valueMin = 0
            c.yValueAxis._valueMax = 7
            c.yValueAxis._valueSteps = [1, 2, 3, 5, 6]
        else:
            c = linecharts.HorizontalLineChart()
            # c.lines[0].strokeWidth = 2
            # c.lines[1].strokeWidth = 1.5
            c.valueAxis._valueMin = 0
            c.valueAxis._valueMax = 60
            c.valueAxis._valueStep = 15

            c.categoryAxis.labels.boxAnchor = 'n'
            c.categoryAxis.labels.dx = 8
            c.categoryAxis.labels.dy = -2
            c.categoryAxis.labels.angle = 30
            
            c.categoryAxis.categoryNames = self._initArgs['categories']

        c.x = self._initArgs['x']
        c.y = self._initArgs['y']
        c.height = self._initArgs['height']
        c.width = self._initArgs['width']
        c.data = data
        c.joinedLines = 1
        c.strokeColor = self._initArgs['stroke_color']


        drawing = Drawing(400, 200)
        drawing.add(c)

        return drawing
    #endregion

