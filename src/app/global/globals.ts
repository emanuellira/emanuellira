/** [# version: 6.4.8 #] */
export const PATH_ = {
  _USUARIOS_: 'usuarios',
  _EVENTOS_: 'eventos',
  _OPTIONS_: 'options',
  _REVISION_: 'revision',
  _LOGIN_: 'login',
  _CATALOGOS_: 'catalogos',
  _CERRAR_SESION_: 'logoff',
  _INDICADORES_: 'indicadores',
};

export const TIPOS_ = {
  Captura: 'Captura',
  Administrador: 'ADMINISTRADOR',
  AdministradorB: 'ADMINISTRADORB',
  Normativo: 'Normativo',
};

export type ICONS_ =
  | 'warning'
  | 'envelope-open-o'
  | 'calendar-o'
  | 'user'
  | 'minus-circle'
  | 'info-circle'
  | 'times-circle'
  | 'check'
  | 'plus-circle';

export const _ICONS_ = [
  'warning',
  'envelope-open-o',
  'calendar-o',
  'user',
  'minus-circle',
  'info-circle',
  'times-circle',
  'check',
  'plus-circle',
];

export type TYPE_ALERT_ =
  | 'primary'
  | 'info'
  | 'danger'
  | 'warning'
  | 'dark'
  | 'light'
  | 'success';
export const _TYPE_ALERT_ = [
  'primary',
  'info',
  'danger',
  'warning',
  'dark',
  'light',
  'success',
];

export const _MODULOS_AYUDA_ = [
  {
    nombre: 'revision',
    id: 'Captura__revision',
  },
  {
    nombre: 'c_admin',
    id: 'ADMINISTRADOR__catalogos',
  },
  {
    nombre: 'r_normativo',
    id: 'Normativo__revision',
  },
  {
    nombre: 'e_normativo',
    id: 'Normativo__eventos',
  },
  {
    nombre: 'r_admin_b',
    id: 'ADMINISTRADORB__revision',
  },
  {
    nombre: 'admin_b',
    id: 'ADMINISTRADORB__eventos',
  },
  {
    nombre: 'u_admin',
    id: 'ADMINISTRADOR__usuarios',
  },
  {
    nombre: 'e_admin',
    id: 'ADMINISTRADOR__eventos',
  },
  {
    nombre: 'r_admin',
    id: 'ADMINISTRADOR__revision',
  },
  {
    nombre: 'admin',
    id: 'ADMINISTRADOR__options',
  },
];

export const _PAIS_SECTOR_ = {
  //Honduras
  _HND_2_: 'HND_2', //Vivienda CONVIVIENDA
  _HND_4_: 'HND_4', //Educaci�n SE
  //Panam�
  _PAN_2_: 'PAN_2', //Vivienda MIVIOT
  _PAN_4_: 'PAN_4', //Educaci�n MEDUCA
  _PAN_6_: 'PAN_6', //Obras P�blicas MOP
  _PAN_7_: 'PAN_7', //Energ�a SE
  _PAN_8_: 'PAN_8', //Agricultura MIDA
  //Guatemala
  _GTM_1_: 'GTM_1', //Salud MSPAS
  _GTM_2_: 'GTM_2', //Vivienda MCIV
  _GTM_6_: 'GTM_6', //Transporte MCIV
  _GTM_8_: 'GTM_8', //Agricultura MAGA
};

export const _PAIS_FILTRO_SECTOR_: { [index: string]: string } = {
  //Honduras
  // _HND_2_: 'HND_2', //Vivienda CONVIVIENDA
  _HND_4_: 'HND_4', //Educaci�n SE
  //Panam�
  // _PAN_2_: 'PAN_2', //Vivienda MIVIOT
  // _PAN_4_: 'PAN_4', //Educaci�n MEDUCA
  // _PAN_6_: 'PAN_6', //Obras P�blicas MOP
  // _PAN_7_: 'PAN_7', //Energ�a SE
  // _PAN_8_: 'PAN_8', //Agricultura MIDA
  //Guatemala
  // _GTM_1_: 'GTM_1', //Salud MSPAS
  // _GTM_2_: 'GTM_2', //Vivienda MCIV
  // _GTM_6_: 'GTM_6', //Transporte MCIV
  // _GTM_8_: 'GTM_8', //Agricultura MAGA
};
