from enum import Enum

class TEXT_ALIGNS(Enum):
    izq = 0
    cen = 1
    der = 2
    cust = 3

class DASHES(Enum):
    normal_ = 0
    simple_ = 1
    dots_ = 2
    complex_ = 3

class TA:
    TA_RIGHT_UP = 5
    TA_RIGHT_DOWN = 6

    TA_LEFT_UP = 7
    TA_LEFT_DOWN = 8

    TA_CENTER_UP = 9
    TA_CENTER_DOWN = 10

    TA_bg = 'BACKGROUND'
    TA_tc = 'TEXTCOLOR'
    TA_box = 'BOX'
    TA_innerg = 'INNERGRID'
    TA_align = 'ALIGN'
    TA_valign = 'VALIGN'
    TA_lineb = 'LINEBELOW'
    TA_linea = 'LINEABOVE'
    TA_linebe = 'LINEBEFORE'
    TA_lineaf = 'LINEAFTER'
    TA_span = 'SPAN'