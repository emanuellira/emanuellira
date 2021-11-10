class Utils():

    def __init__(self, w, h):
        self.w = w
        self.h = h

        self.color_patterns = {
            # Match colors in format #XXX, e.g. #416.
            'HEX3': '#([a-f0-9])([a-f0-9])([a-f0-9])$',
            # Match colors in format #XXXXXX, e.g. #b4d455.
            'HEX6': '#([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$',
            # Match colors in format rgb(R, G, B), e.g. rgb(255, 0, 128).
            'RGB': 'rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)',
            # Match colors in format rgb(R, G, B, A), e.g. rgb(255, 0, 128, 0.25).
            'RGBA': 'rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),((?:\d+(?:\.\d+)?)|(?:\.\d+))\)',
            #Match colors in format rgb(R%, G%, B%), e.g. rgb(0.4, 0, 0.9).
            'RGB_PERC': 'rgb\(((?:\d+(?:\.\d+)?)|(?:\.\d+)),((?:\d+(?:\.\d+)?)|(?:\.\d+)),((?:\d+(?:\.\d+)?)|(?:\.\d+))\)'
        }


    def _get_center_(self):
        return (self.w / 2, self.h / 2)

    def _get_list_coor_(self, linelist):
        list = []

        for coor in linelist:
            list.append((coor[0], self.h - coor[1], coor[2], self.h - coor[3]))

        return list

    def _get_coor_(self, x1, x2, y1, y2):
        # print(self.w, self.h)
        return (
            x1 if x2 == None else x2,
            self.h - y1 if y2 == None else self.h - y2,
            y1 if y2 == None else y2
        )

    def _parse_color_(self, color):
        import re
        
        hex3 = re.match(self._utils_.color_patterns['HEX3'], color.lower())
        hex6 = re.match(self._utils_.color_patterns['HEX6'], color.lower())
        rgb = re.match(self._utils_.color_patterns['RGB'], color)
        rgba = re.match(self._utils_.color_patterns['RGBA'], color)
        rgb_perc = re.match(self._utils_.color_patterns['RGB_PERC'], color)
        alpha = 1
        r, g, b = (0, 0, 0)

        if hex3:
            r, g, b = (
                int(f'{hex3.group(1)}{hex3.group(1)}', 16),
                int(f'{hex3.group(2)}{hex3.group(2)}', 16),
                int(f'{hex3.group(3)}{hex3.group(3)}', 16)
            )

        elif hex6:
            r, g, b = (
                int(hex6.group(1), 16),
                int(hex6.group(2), 16),
                int(hex6.group(3), 16)
            )

        elif rgb:
            r, g, b = (int(rgb.group(1)), int(rgb.group(2)), int(rgb.group(3)))

        elif rgba:
            r, g, b, alpha = (
                int(rgba.group(1)),
                int(rgba.group(2)),
                int(rgba.group(3)),
                float(rgba.group(4))
            )
        elif rgb_perc:
            r, g, b = (float(rgb_perc.group(1)), float(rgb_perc.group(2)), float(rgb_perc.group(3)))

        return (r, g, b, alpha)

    def get_percent(self, r, g, b):
        return (r / 255, g / 255, b / 255)


