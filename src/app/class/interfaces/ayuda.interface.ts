// [# version: 6.4.4 #]
import { IVersion } from "./plantilla.interface";

export interface IDataAyuda {
  id?: number;
  nombre?: string;
  video?: string;
  tags?: string[];
  pasos?: string[];
  tips: string[];
  iconos: string[];
  ida?: number[];
}

export interface IAyuda {
  version: IVersion;
  data: IModuloAyuda;
}

export interface IModuloAyuda {
  [index: string]: Array<IDataAyuda>
  // revision: Array<IDataAyuda>;
  // catalogos: Array<IDataAyuda>;    
}

