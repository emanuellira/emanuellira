
export interface ICatalogo {
  ID: number;
  Grupo: string;
  Valor: string;
  Descripcion: string;
  Sectores: string;
}

export interface IGrupos_Catalogos {
  [index: string]: Array<ICatalogo>;
}

export interface ISectores {
  ID?: number;
  ClaveSector?: number;
  NomSector?: string;
  Tipo?: number;
  AbrevMin: string;
  Ministerio?: string;
  Activo?: number;
  FechaCreado?: string;
  FechaModificado?: string;
  lst_cat: Array<ICatalogoTipo>; 
}

export interface IGrupo_Sectores {
  [index: string]: Array<ISectores>;
}

export interface ICatalogoTipo{
  label: string;
  campo?: string;
  size?: string;
  extension?: string;
  file?: File;
}

export interface IDivAdmin2{
  OBJECTID?: string;
  Shape?: string;
  NOMBRE?: string;
  DIVADMIN1?: string;
  DIVADMIN2: string;
  CVE?: string;
}

export interface IDivAdmin3 {
  OBJECTID?: string;
  Shape?: string;
  NOMBRE?: string;
  DIVADMIN1?: string;
  DIVADMIN2?: string;
  DIVADMIN3: string;
  CVE?: string;
}