/** [# version: 6.4.6 #] */
import { IVersion } from './plantilla.interface';
import { IResultado } from './resultado.interface';

export interface IMenu {
  id?: number,
  label: string;
  icon: string;
  btn: string;
  nav?: string;
  evento?: Function;
  visible?: boolean;
  campo?: string;
  data?: Array<IResultado>;
}

export interface IMenusJson {
  version: IVersion;
  menu: IMenuJson;
}

export interface IMenuJson {
  nav: IMenu[];
  btn: IMenu[];
  catalogos: IMenu[];
  indicadores: IMenu[];
}
