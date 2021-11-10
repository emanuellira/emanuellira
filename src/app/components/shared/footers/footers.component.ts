// [# version: 6.4.8 #]
import { Component, Input, OnInit } from '@angular/core';
import { IDiags } from 'src/app/class/interfaces/diags.interface';
import { IDictionary_String, IKeyPair } from 'src/app/class/interfaces/keypair.interface';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { DbapiService } from 'src/app/services/dbapi.service';
import { DownloadService } from 'src/app/services/download.service';
import { LangService } from 'src/app/services/lang.service';
import { TotalesService } from 'src/app/services/totales.service';

@Component({
	selector: 'app-footers',
	templateUrl: './footers.component.html',
	styleUrls: ['./footers.component.css']
})
export class FootersComponent implements OnInit {
	//#region [Propiedades]:
	@Input() items: Array<IDiags> = [];
	foot_totales: Array<IKeyPair> = [];
	simb: string = '';
	language!: iModuleLang;
	//#endregion

	//#region [OnInit]: Name-> constructor, ngOnInit
	constructor(
		private _totales_: TotalesService,
		private _db_api_: DbapiService,
		private _download_: DownloadService,
		private _lang_: LangService
	) {}

	ngOnInit(): void {
		this._lang_.modulo = 'footers';
		this.language = this._lang_.language_by_modulo;
		this.foot_totales = [
			{ key: this.language.costo_total_danio, value: this.language.valor_ctd},
			{ key: this.language.costos_administrativos, value: this.language.valor_ca},
			{ key: this.language.costo_total, value: this.language.valor_ct },
			{ key: this.language.menaje, value: this.language.valor_m},
			{ key: this.language.perdidas, value: this.language.valor_p }
		];
		this._totales_.items = this.items;
		this.Calcular();
	}
	//#endregion

	//#region [Function]: Name-> Calcular
	/**
	 * @description se ejecuta para realizar cambios por primera vez
	 */
	Calcular = () => {
		this.simb = this._db_api_.Simb_Moneda || '';
		this.Costo_Total_D();
		this.Costo_Admin();
		this.Costo_Total();
		this.Verifica_Menaje();
		this.Costos_Perdidas();
		// console.log(this.foot_totales);
		this.Filtrar_Elementos_Menos1();
	};

	//#endregion

	//#region [Function]: Name-> Al recibir cambios de montos desde dynamic table
	/**
	 * @description recibe el nombre del campo que se está modificando y busca la función adecuada
	 * para invocar y calcular los montos
	 * @param args el nombre del campo que se está modificando
	 */
	Change_Totales = (args: Array<string>) => {
		// console.log('Re calcular totales', args);
		const calcs_dict: { [index: string]: any } = {
			CostoAdmin: this.Costos_Admin_Total,
			CostoUnitario: this.Costos_Totales,
			Unidades: this.Costos_Totales
			// 'CostoTotalR': this.Costo_Total
		};

		if (calcs_dict[args[1]]) calcs_dict[args[1]]();
		this.Verifica_Menaje();
		this.Costos_Perdidas();

		this.Filtrar_Elementos_Menos1();
	};

	Costos_Totales = () => {
		this.Costo_Total_D();
		this.Costo_Total();
	};

	Costos_Admin_Total = () => {
		this.Costo_Admin();
		this.Costo_Total();
	};

	Costos_Perdidas = () => {
		// console.log(this._download_.perdidas);
		const perdidas: IDictionary_String = {
			VIV_6PER: this.VIV_6PER
		};

		if (perdidas[this._download_.perdidas]) perdidas[this._download_.perdidas]();
	};
	//#endregion

	//#region [Function]: Name-> Pérdidas
	/**
	 * Warning-> Se asume que las pérdidas se calculan a partir del costo total por lo que si cambia el
	 * requerimiento, cambiaría la lógica del código
	 */
	VIV_6PER = () => {
		const colapsados = this._totales_.Get_Colapsados_MAY75();
		
		let suma_6per = 0;
		colapsados.forEach(
			(c: IDiags) =>
				(suma_6per +=
					c.TipoAdmin === 'arrendamiento'
						? this._totales_.Perdidas_VIV_6PER(Number(c.CostoTotalObra))
					: 0)
			
		);
		// for (const c of colapsados) {
		//   if (c.TipoAdmin === 'arrendamiento') {
		//     console.log(`arrendamiento: ${c.CostoTotalObra}`);
		//     suma_6per += this._totales_.Perdidas_VIV_6PER(Number(c.CostoTotalObra));
		//   }
		// }
		this.foot_totales[4].value = `${this.simb} ${suma_6per.toLocaleString()}`;
	};
	//#endregion

	Verifica_Menaje = () => {
		if (this._download_.has_menaje) {
			const colapsados = this._totales_.Get_Colapsados_MAY75();
			let suma = 0;
			for (const item of colapsados) {
				suma += Number(item.CostoTotalObra) + this._download_.menaje;
			}
			this.foot_totales[3].value = `${this.simb} ${suma.toLocaleString()}`;
		}
	};

	//#region [Function]: Name-> Totales: Costot D, Costo Total, Costo Admin
	Costo_Total_D = () =>
		(this.foot_totales[0].value = `${this.simb} ${this._totales_
			.Costo_Total_D()
			.toLocaleString()}`);

	Costo_Admin = () =>
		(this.foot_totales[1].value = `${this.simb} ${this._totales_
			.Costo_Admin()
			.toLocaleString()}`);

	Costo_Total = () =>
		(this.foot_totales[2].value = `${this.simb} ${this._totales_
			.Costo_Total()
			.toLocaleString()}`);
	//#endregion

	Filtrar_Elementos_Menos1 = () =>
		(this.foot_totales = this.foot_totales.filter((f) => f.value !== '-1'));
}
