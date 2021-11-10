/* [# version: 6.4.14 #] */
export interface IPlantilla {
	sector: ISector;
	version: IVersion;
	data: IData[];
	entrevista: IData[];
	capturista: IData[];
	config: IConfig;
}

export interface IConfig {
	dias: number;
}

export interface IData {
	campo: string;
	alias: string;
	tipo?: string;
	required?: string;
	formato?: string;
	lista?: string;
	estatus?: string;
	editable?: boolean;
	ignore?: boolean;
	activo?: boolean;
	/**
	 * Se agrega para la evaluación del dato al momento de guardar cambios
	 */
	value?: Object;
	required_nuevo?: string;
}

export interface IEntrevista {
	 [index: string]: string;
}

export interface IVersion {
	release: number;
	candidate: number;
	test: number;
	debug: number;
}

export interface ISector {
	nombre: string;
	clave: number;
	menaje: number;
	perdidas: string;
	costo_adicional: number;
}
