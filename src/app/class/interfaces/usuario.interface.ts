/** [# version: 6.2.3 #] */
export interface IUsuario {
  IDUsuario: number;
  IDEvento?: number;
  Apellidos?: string;
  Bloqueado?: boolean;
  Caducado?: boolean;
  Cargo?: string;
  Correo?: string;
  DescripcionPerfil?: string;
  FechaCreado?: Date;
  FechaExpira?: Date;
  HayError?: boolean;
  IDNumero?: number;
  IDProvincia?: number;
  IDPerfil?: number;
  IV?: string;
  IdPerfil?: number;
  Key1?: string;
  LimiteSesion?: number;
  MensajeError?: string;
  MensajeErrorTecnico?: string;
  Nivel?: string;
  NomSector?: any;
  NomUsuario?: string;
  Nombre?: string;
  Password?: string;
  Provincia?: any;
  Sector?: number;
  SesionesIniciadas?: number;
  Tipo: string;
  Token: string;
  TokenCaducado?: boolean;
}