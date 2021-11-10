/** [# version: 6.4.6 #] */
export interface IConfig {
  Uri3?: string;
  pais_abrv?: string;
  plantillas?: string;
  imagenes?: string;
  pais_reporte?: string;
  ssl?: boolean;
  culture?: string;
  sim_moneda?: string;
  sired_api_key?: string;
}

export interface IDateSplit {
  y?: string;
  m?: string;
  d?: string;
  h?: string;
  min?: string;
}
