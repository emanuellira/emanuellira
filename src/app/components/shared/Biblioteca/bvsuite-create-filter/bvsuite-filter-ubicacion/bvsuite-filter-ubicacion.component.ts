//[# version: 7.5.5 #]
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { IDivAdmin2, IDivAdmin3 } from 'src/app/class/interfaces/catalogo.interface';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { AlertsService } from 'src/app/services/alerts.service';
import { DbapiService } from 'src/app/services/dbapi.service';
import { LangService } from 'src/app/services/lang.service';

@Component({
    selector: 'app-bvsuite-filter-ubicacion',
    templateUrl: './bvsuite-filter-ubicacion.component.html',
    styleUrls: ['./bvsuite-filter-ubicacion.component.css']
})
export class BvsuiteFilterUbicacionComponent implements OnInit {
    //#region [Propiedades]
    // @Input() tipo: string = '';
    // @Input() es_reporte_filtro: boolean = false;
    frm: FormGroup;
    private _IDDIVADMIN2_: string = '01';
    private _IDDIVADMIN3_: string = '';
    @Input() items: Array<IDivAdmin2> = [];
    @Input() items_muns: Array<IDivAdmin3> = [];
    language!: iModuleLang;
    //#endregion

    //#region [OnInit]: Name-> constructor, onInit
    constructor(
        private _alert_: AlertsService,
        private _fb_: FormBuilder,
        private _db_api_: DbapiService,
        private _lang_: LangService
    ) {
        this.frm = this._fb_.group({});
    }

    ngOnInit(): void {
        this._lang_.modulo = 'ubicacion';
    this.language = this._lang_.language_by_modulo;
        this.CrearFormulario();
    }
    //#endregion

    //#region [Function]: Name-> Crear Form
    private CrearFormulario = () => {
        this.frm = this._fb_.group({
            selDIVADMIN2: this._IDDIVADMIN2_,
            selDIVADMIN3: this._IDDIVADMIN3_
        });
        this.Get_Muns();
    };
    //#endregion

    //#region [Getters]: Name-> selDIVADMIN2, selDIVADMIN2
    private get selDIVADMIN2() {
        return <FormControl>this.frm.get('selDIVADMIN2');
    }

    private get selDIVADMIN3() {
        return <FormControl>this.frm.get('selDIVADMIN3');
    }

    private get can_create_list(): boolean {
        this._IDDIVADMIN3_ = this.selDIVADMIN3.value;
        return this._IDDIVADMIN2_ !== '';
    }
    //#endregion

    //#region [Eventos]: Name-> On_Select_DIVADMIN2
    OnSelect_DIVADMIN2 = () => {
        this._IDDIVADMIN2_ = this.selDIVADMIN2.value;
        this.Get_Muns();
    };
    //#endregion

    //#region [Function]: Name-> Get_Muns, Get_Pipe_List
    private Get_Muns = () => {
        this._alert_.SetLoading = this.language.espere;
        this._db_api_.Get_Municipios(Number(this._IDDIVADMIN2_)).subscribe(
            (municipios) => {
                // console.log(municipios);

                this.items_muns = municipios;
                this.items_muns.splice(0, 0, {
                    OBJECTID: '',
                    Shape: '',
                    NOMBRE: '[Seleccione municipio]',
                    DIVADMIN1: '',
                    DIVADMIN2: '',
                    DIVADMIN3: '',
                    CVE: ''
                });
                this.selDIVADMIN3.setValue(municipios[0].DIVADMIN3);
                this._alert_.Close();
            },
            (err) => {
                this._alert_.Close();
                console.error(err);
            }
        );
    };

    Get_Pipe_List = () => {
        return new Promise((resolve, reject) => {
            let lista: Array<string> = [];
            if (this.can_create_list) {
                lista.push('IDDIVADMIN2');
                lista.push(Number(this._IDDIVADMIN2_).toString());
                lista.push('string');
                lista.push('AND');
                lista.push('');
                console.log(this._IDDIVADMIN3_);
                if (this._IDDIVADMIN3_) {
                    console.log(this._IDDIVADMIN3_);
                    lista.push('IDDIVADMIN3');
                    lista.push(Number(this._IDDIVADMIN3_).toString());
                    lista.push('string');
                    lista.push('AND');
                    lista.push('');
                }
            }
            resolve(lista.join('|'));
            reject(`Debe seleccionar un filtro`);
        });
    };
    //#endregion
}
