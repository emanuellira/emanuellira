from reportlab.platypus import Image
from reportlab.lib.units import cm
import os

class load_image_():

    _initArgs = {
        'img_name': None,
        'default_path': 'assets\\images',
        'type': 'png',
        'size': (5, 5)
    }

    #region [OnInit]: Name-> __init__
    def __init__(self, img_name):
        self.img_name = img_name
    #endregion

    def __call__(self, **kw):
        for k in self._initArgs.keys():
            v = None
            if k in kw:
                v = kw[k]            
                self._initArgs[k] = v

        path = os.path.abspath(__file__)
        path = path.replace('3\\api\\Reportes\\package\\images_\\image.py', self._initArgs['default_path'])
        img_name = self._initArgs['img_name']
        ext = self._initArgs['type']
        path = f'{path}\\{img_name}.{ext}'
        img = Image(path)
        img.drawWidth, img.drawHeight = (self._initArgs['size'][0] * cm, self._initArgs['size'][1] * cm)
                
        return img