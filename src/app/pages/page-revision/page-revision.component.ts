/** [# version: 6.4.29 #] */
import { Component, OnInit, ViewChild } from '@angular/core';
import { IAccion, IActivo, IDiags } from 'src/app/class/interfaces/diags.interface';
import { IEvento } from 'src/app/class/interfaces/evento.interface';
import { IMenu } from 'src/app/class/interfaces/menu.interface';
import { PATH_, _PAIS_FILTRO_SECTOR_ } from 'src/app/global/globals';
import { AlertsService } from 'src/app/services/alerts.service';
import { DbapiService } from 'src/app/services/dbapi.service';
import { LoginService } from 'src/app/services/login.service';
import { NavigationService } from 'src/app/services/navigation.service';
import { DownloadService } from 'src/app/services/download.service';
import { IData } from 'src/app/class/interfaces/plantilla.interface';
import { ICatalogo } from 'src/app/class/interfaces/catalogo.interface';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { BvsuiteCreateUploadNotifyComponent } from 'src/app/components/shared/Biblioteca/bvsuite-create-upload-notify/bvsuite-create-upload-notify.component';
import { ToolVerMasComponent } from 'src/app/components/tools/tool-ver-mas/tool-ver-mas.component';
import { HayError } from 'src/app/class/hay-error';
import { DynamicTableComponent } from 'src/app/components/tools/dynamic-table/dynamic-table.component';
import { FootersComponent } from 'src/app/components/shared/footers/footers.component';
import { TotalesService } from 'src/app/services/totales.service';
import { BvsuiteCreateFilterComponent } from 'src/app/components/shared/Biblioteca/bvsuite-create-filter/bvsuite-create-filter.component';
import { LangService } from 'src/app/services/lang.service';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';

// import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';

@Component({
    selector: 'app-page-revision',
    templateUrl: './page-revision.component.html',
    styleUrls: ['./page-revision.component.css']
})
export class PageRevisionComponent implements OnInit {
    //#region [Propiedades]: Name->
    menu_items: Array<IMenu> = [];
    btns_items: Array<IMenu> = [];
    items: Array<IDiags> = [];
    // diag_temp: IDiags = {};
    items_headers: Array<IData> = [];
    evento: IEvento = {};
    editar: boolean = false;
    swith: boolean = false;
    IDAccion: number = 0;
    IDActivo: number = 0;
    id: number = 0;
    modulo: string = '';

    @ViewChild(BvsuiteCreateUploadNotifyComponent) // @ts-ignore
    bv_suite: BvsuiteCreateUploadNotifyComponent;
    // @ts-ignore
    @ViewChild(ToolVerMasComponent) tool_vermas: ToolVerMasComponent;
    // @ts-ignore
    @ViewChild(DynamicTableComponent) table: DynamicTableComponent;
    // @ts-ignore
    @ViewChild(FootersComponent) footer: FootersComponent;
    // @ts-ignore
    @ViewChild(BvsuiteCreateFilterComponent) filter: BvsuiteCreateFilterComponent;
    language!: iModuleLang;
    //#endregion

    //#region [constructor]:
    constructor(
        private _alert_: AlertsService,
        private _navigate_: NavigationService,
        private _db_api_: DbapiService,
        private _login_: LoginService,
        private _download_: DownloadService,
        private _catalogos_: CatalogosService,
        private _totales_: TotalesService,
        private _lang_ : LangService
    ) { }
    //#endregion

    //#region [OnInit]: Name-> ngOnInit
    ngOnInit(): void {
        this.modulo = this._login_.Define_modulo('revision');
        // Para activar el json de lenguaje:
        // ~1. EL módulo
        this._lang_.modulo = 'revision';
        // ~2. La misma línea para cada módulo
        this.language = this._lang_.language_by_modulo;
        this.Crea_Menu();
    }
    //#endregion

    //#region [Function]: Name-> Item NavBar Clic
    /**
     * @description Recibe los resultados de la búsqueda y solicita la actualización
     */
    Item_NavBar_Change = (_items_: Array<IDiags>) => {
        this.table.Change_Items(0, _items_);
    };
    /**
     * @name Item_NavBar_Click
     * @param _item_name_ recibe el nombre del menú desde app-navbar o dynamic-table,
     * busca el item y si encuentra una coincidencia invoca el método correspondiente,
     * en caso contrario crea un IMenu e invoca a NoneEvent
     */
    Item_NavBar_Click = (args: Array<string>): void => {
        const _item_name_ = args[0];
        let func: IMenu | null = this.menu_items.find((f) => f.label === _item_name_) ?? null;
        if (func === null) {
            func = this.btns_items.find((f) => f.label === _item_name_) ?? {
                label: '',
                icon: '',
                btn: '',
                evento: this.NoneEvent
            };
        }
        if (func.evento) func.evento(args);
    };
    //#endregion

    //#region [Function]: Name-> Get_Diag
    /**
     *
     * @param _id_ identificador del item
     * @returns el elemento encontrado
     */
    Get_Diag = (_id_: string) =>
        this.items.filter((item) => Number(item['IDAccion']) === Number(_id_))[0];
    //#endregion

    //#region [Function]: Name-> Get_Headers
    public Get_Headers = () => {
        // Todo-> Leer los encabezados del json
        this._download_.Get_Json_Plantillas(this._login_.Sector_Captura).subscribe(
            (headers) => {
                this.Get_Catalogos(headers)
            },

            (err) => {
                this._alert_.Close();
                console.error(err);
            }
        );
    };
    //#endregion

    //#region [Function]: Name-> Get Catalogos
    /**
     * Obtiene la lista de catálogos y realiza un reduce para agrupar
     * los elementos.
     */
    public Get_Catalogos = (headers: IData[]) => {
        this.items_headers = headers;

        this._db_api_.Get_Catalogos(this._login_.Sector).subscribe(
            (catalogos) => {
                // Todo-> Tarea por hacer
                this._alert_.Close();

                this._catalogos_.Data = catalogos.reduce((grupo: any, item: ICatalogo) => {
                    grupo[item.Grupo] = grupo[item.Grupo] || [];
                    grupo[item.Grupo].push(item);
                    return grupo;
                }, Object.create(null));
                console.log(this._catalogos_.Data);
                this._catalogos_.Set_Values_UnidadM();
                this._catalogos_.ItemHeaders = this.items_headers;
            },
            (err) => {
                this._alert_.Close();
                console.error(err);
            }
        );
    };

    //#endregion

    //#region [Function]: Name-> Item_Change_Table
    Item_Change_Table = (args: Array<string>) => this.footer.Change_Totales(args);
    //#endregion

    //#region [Function]: Name-> Items Menu

    //#region  Nota-> Actualizar
    /**
     * @name Actualizar Actualiza la información de la tabla de daños
     * @param item_name Recibe el nombre del item menú: Actualizar. Permite
     * iniciar la consulta de datos o actualizarla.
     */
    Actualizar = (): void => {
        if (this.editar) {
            this._alert_.FireToastOwn(
                this.language.actualmente_edicion,
                'warning',
                'warning'
            );
            return;
        }
        this._alert_.SetLoading = this.language.leyendo_recopilacion_d;
        this.items = [];
        this._db_api_.Get_Capturas(this._login_.IDUsuario_Captura, this._login_.Tipo).subscribe(
            (diags) => {
                this.items = diags;
                // console.log(diags);
                if (this.items.length > 0) {
                    this.Get_Headers();
                    // this.footer.Costo_Admin();
                } else this._alert_.Close();
            },
            (err) => {
                this._alert_.Close();
                console.error(err);
            }
        );
    };
    //#endregion

    //#region  Nota-> Reporte con Filtro
    /**
     * @name Preliminar Genera un reporte en pdf
     * @param args Recibe el nombre del item menú: Preliminar
     */
    Reporte_Filtro = (args: Array<string>): void => {


        if (this.editar) {
            this._alert_.FireToastOwn(
                this.language.actualmente_edicion,
                'warning',
                'warning'
            );
            return;
        }
        this.filter.On_Show('WORD');
    };
    //#endregion

    //#region  Nota-> Preliminar
    /**
     * @name Preliminar Genera un reporte en pdf
     * @param args Recibe el nombre del item menú: Preliminar
     */
    Preliminar = (args: Array<string>): void => {
        if (this.editar) {
            this._alert_.FireToastOwn(
                this.language.actualmente_edicion,
                'warning',
                'warning'
            );
            return;
        }
        this.bv_suite.On_Show('WORD');
    };
    //#endregion

    //#region  Nota-> Definitivo
    /**
     * @name Preliminar Genera un reporte en pdf
     * @param args Recibe el nombre del item menú: Preliminar
     */
    Definitivo = (args: Array<string>): void => {
        if (this.editar) {
            this._alert_.FireToastOwn(
                this.language.actualmente_edicion,
                'warning',
                'warning'
            );
            return;
        }
        this.bv_suite.On_Show('WORD', false);
    };
    //#endregion

    //#region  Nota-> Descargar a Excel
    /**
     * @name Descargar_A_Excel Genera el archivo en formato csv
     * @param args Recibe el nombra del item-menú: Descargar A Excel
     */
    Descargar_A_Excel = (args: Array<string>): void => {
        if (this.editar) {
            this._alert_.FireToastOwn(
                this.language.actualmente_edicion,
                'warning',
                'warning'
            );
            return;
        }
        this.bv_suite.On_Show('CSV');
    };
    //#endregion

    //#region  Nota-> Descargar a Excel Definitivo
    /**
     * @name Descargar_A_Excel_Def Genera el archivo en formato csv
     * @param args Recibe el nombra del item-menú: Descargar A Excel
     */
    Descargar_A_Excel_Def = (args: Array<string>): void => {
        if (this.editar) {
            this._alert_.FireToastOwn(
                this.language.actualmente_edicion,
                'warning',
                'warning'
            );
            return;
        }
        this.bv_suite.On_Show('CSV', false);
    };
    //#endregion

    //#region  Nota-> Mostrar Mapa
    /**
     * @name Mostrar_Mapa Muestra el mapa y oculta la vista de daños
     * @param args Recibe el nombre del item-menú: 'Mostrar Mapa
     */
    Mostrar_Mapa = (args: Array<string>): void => {
        if (this.editar) {
            this._alert_.FireToastOwn(
                this.language.actualmente_edicion,
                'warning',
                'warning'
            );
            return;
        }
        this._alert_.ShowWait(args[0]);
    };
    //#endregion

    //#region  Nota-> Autorizar
    /**
     * @description autoriza el evento y manda el sector autorizado
     * @returns
     */
    Autorizar = (): void => {
        if (this.editar) {
            this._alert_.FireToastOwn(
                this.language.actualmente_edicion,
                'warning',
                'warning'
            );
            return;
        }
        this._alert_.SetLoading = this.language.autorizando;
        this._db_api_
            .Autorizar_Evento({
                IDEvento: this.evento.IDEvento,
                Estatus: this._login_.Sector.toString()
            })
            .subscribe(
                (resultado) => {
                    this._alert_.ShowWait(resultado.Descripcion, '');
                    const def = this.menu_items.find((f) => f.id === 2);
                    if (def) def.visible = true;
                    const exc_def = this.menu_items.find((f) => f.id === 4);
                    if (exc_def) exc_def.visible = true;
                    // console.log(resultado);
                },
                (err) => {
                    this._alert_.Close();
                    console.log(err);
                }
            );
    };
    //#endregion

    //#region  Nota-> Cerrar Sesión
    /**
     * @name Cerrar_Sesión cierra la sesión actual
     */
    Cerrar_Sesion = (): void => {
        this._alert_.Confirm( this.language.cerrar_sesion).then((choice: string) => {
            if (choice === 'ok') {
                this._navigate_.Next_View = { path: PATH_._CERRAR_SESION_ };
            }
        });
    };
    //#endregion

    //#region  Nota-> NoneEvent
    /**
     * @name Solo sirve para mostrar un mensaje por si el item no tiene
     *   relacionado un evento
     */
    NoneEvent = (): void => {
        this._alert_.ShowWait(this.language.item_no_relacionado_evento, '');
    };
    //#endregion

    //#region [Function]: Name-> Buttons Items

    // private Esta_Editando_Otro_Item_ = (_IDAccion_: string): boolean => {
    //   if (this.editar) {
    //     this._alert_
    //       .Confirm(
    //         'Editando',
    //         `
    //     <span>
    //       Ya se está editando otro elemento
    //       <strong>
    //         ¿Desea guardar el otro elemento y editar el actual?
    //       </strong>
    //     </span>`
    //       )
    //       .then((choice) => {
    //         if (choice === 'ok') {
    //           this.IDAccion = Number(_IDAccion_);
    //           // Todo->
    //           // ~1. Recuperar el IDAccion del otro elemento
    //           const grupo = this._db_api_.btn_items_group.filter(
    //             (g) => g.find((f) => f.label === 'edit')?.visible === false
    //           )[0];
    //           // ~2. Guardar la información
    //           const id = grupo[0].id || 0;
    //           this.Save_Loss(['guardar', id.toString(), 'ContinuarEditando']);
    //           // ~3. Cambiar al nuevo elemento
    //         }
    //       });
    //     return true;
    //   }
    //   return false;
    // };

    //#region  Nota-> Edit Loss
    /**
     * @description Prepara la información para editar y almacena los datos
     * en una variable temporal. También prepara las listas
     * @param args
     * @returns
     */
    Edit_Loss = (args: Array<string>): void => {
        // if (this.Esta_Editando_Otro_Item_(args[1])) {
        //   return;
        // }
        if (this.editar) {
            this._alert_.FireToastOwn(
                this.language.actualmente_edicion,
                'warning',
                'warning'
            );
            return;
        }
        this.IDAccion = Number(args[1]);

        //Obtiene el item por IDAccion
        let diag: IDiags = this.Get_Diag(args[1]);
        this.table.diag_temp = { ...diag };
        //Obtiene las listas		
        for (const h of this.items_headers) {
            if (h.lista) {
                const lista = h.lista.split('|');
                if (lista.length === 1 && this._catalogos_.Get_Item(h.lista)) {
                    diag[`${h.lista}_lista`] = this._catalogos_
                        .Get_Item(h.lista)
                        .map((item) => item.Valor)
                        .join('|');
                } else {
                    diag[`${h.campo}_lista`] = h.lista;
                }
            }
        }
        // console.log(this._catalogos_.Data);

        // Nota-> Controlar la edición del item
        this.editar = true;
        this._db_api_.Btns_Edition(this.IDAccion);

        //Si tiene costo adicional ejecuta un método anónimo (() => {})();
        this._download_.has_costo_adicional &&
            (() => {
                this._totales_.item = diag;
                this._totales_.Set_Costo_Adicional(this._download_.costo_adicional);
            })();
    };

    //#endregion

    //#region  Nota-> Delete Loss
    /**
     * @description Elimina el registro ( Nota-> Solo coloca a 0 en la BD)
     * @param args
     * @returns
     */
    Delete_Loss = (args: Array<string>): void => {
        if (this.editar) {
            this._alert_.FireToastOwn(
                this.language.actualmente_edicion,
                
                'warning',
                'warning'
            );
            return;
        }
        this._alert_
            .Confirm(
                this.language.borrar_elemento,
                `<span class="text-danger">${this.language.borrar_elemento_2}</span>`
            )
            .then((choice: string) => {
                if (choice === 'ok') {
                    // this._alert_.SetLoading = 'Eliminando elemento seleccionado...';
                    this._db_api_.Delete_Captura(Number(args[1]), this._login_.Tipo).subscribe(
                        (result) => {
                            // Todo-> Tarea por hacer
                            this._alert_.ShowWait(result.Descripcion);
                            this.Actualizar();
                        },
                        (err) => {
                            // Warning-> Capturar el error
                            console.error(err);
                        }
                    );
                }
            });
    };
    //#endregion

    //#region  Nota-> Save Loss
    /**
     * @description Prepara los dato a guardar, primero guarda los datos del
     * activo y posteriormente los datos de la acción
     * @param args
     * @returns
     */
    Save_Loss = async (args: Array<string>): Promise<void> => {
        //this._alert_.SetLoading = 'Enviando información...';
        //Recupera el item
        let _diag_: IDiags = this.Get_Diag(args[1]);
        //Limpia el activo y lo llena con los datos cambiados
        let _activo_ = await this.Fill_Activo(_diag_);
        //Limpia la accion y la llena con los datos cambiados
        let _accion_ = await this.Fill_Accion(_diag_);
        // console.log(_diag_);
        
        const hay_error = this.Evalua_Loss(_diag_);
        // console.log(hay_error);
        if (hay_error.Hay_Error) {
            this._alert_.FireToast(hay_error.Mensaje, 'error');
            return;
        }
        this._alert_.SetLoading = this.language.guardando;
        // Guardar la información
        this._db_api_.Save_Activo(_activo_, this._login_.Tipo).subscribe(
            (data) => {
                _activo_.EstatusAseguramiento = 'SIRED';
                // console.log(args[1]);
                this.table.Update_Estatus_Item(Number(args[1]));
                this._db_api_.Save_Accion(_accion_, this._login_.Tipo).subscribe(
                    (dataAcc) => {
                        this._alert_.ShowWait('Guardar', dataAcc.Descripcion, 'success');
                        this._db_api_.Btns_Edition(Number(args[1]));
                        this.editar = false;
                        this.table.Set_Estatus_Revisado(args[1], 'IDAccion');
                        //Si el usuario está editando y cambia de elemento
                        if (args[2] === 'ContinuarEditando') {
                            this.Edit_Loss(['edit', this.IDAccion.toString()]);
                        }
                    },
                    (err) => {
                        this._alert_.ShowWait('Error', err, 'error');
                        console.error(err);
                    }
                );
            },
            (err) => {
                this._alert_.ShowWait('Error', err.Message, 'error');
                console.error(err);
            }
        );
    };
    //#endregion

    //#region  Nota-> Cancel Loss
    /**
     * @description Cancela la edición y recupera los datos originales
     * @param args
     */
    Cancel_Loss = (args: Array<string>): void => {
        this._alert_
            .Confirm(
               this.language.cancelar_edicion,
                `<span class="text-danger">${this.language.cancelar_edicion_2}</span>`
            )
            .then((choice: string) => {
                if (choice === 'ok') {
                    // Regresa los datos originales
                    this.table.Set_Items_OnShow_ByID_(args[1], 'IDAccion');
                    this.editar = false;
                    this._db_api_.Btns_Edition(Number(args[1]));
                }
            });
    };
    //#endregion

    //#region  Nota-> View More
    /**
     * @description Envía los datos a una ventana modal para mostrar más datos
     * @param args
     */
    View_More = (args: Array<string>): void => {
        // this._alert_.ShowWait(args[0]);
        this.tool_vermas.On_Show(this.Get_Diag(args[1]));
    };
    //#endregion
    //#endregion

    //#region [Function]: Name-> Fill Activo y Accion
    private Fill_Activo = (diag: IDiags): Promise<IActivo> => {
        return new Promise((resolve, reject) => {
            this._download_.Get_Json_Activo().subscribe(
                (file) => {
                    let _activo_: IActivo = {};
                    for (var prop of Object.keys(file)) {
                        _activo_[prop] = file[prop];
                        if (diag[prop]) _activo_[prop] = diag[prop];
                    }

                    resolve(_activo_);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    };

    private Fill_Accion = (diag: IDiags): Promise<IAccion> => {
        return new Promise((resolve, reject) => {
            this._download_.Get_Json_Accion().subscribe(
                (file) => {
                    let _accion_: IAccion = {};
                    for (var prop of Object.keys(file)) {
                        _accion_[prop] = file[prop];
                        if (diag[prop]) _accion_[prop] = diag[prop];
                    }

                    resolve(_accion_);
                },
                (err) => {
                    reject(err);
                }
            );
        });
    };
    //#endregion

    //#region [Function]: Name-> Crea Menú
    /**
     * @name Crea_Menu
     * @description Crea el menú de la barra y solicita los datos del evento para
     * colocar la información en el header-info
     */
    private Crea_Menu(): void {
        this._download_.Get_Json_Menus('revision').subscribe(
            (menu) => {
                this._alert_.SetLoading = this.language.leyendo_info_evento;
                //Trae la información del evento relacionado a las capturas
                this._db_api_.Get_Evento(this._login_.IDEvento_Captura).subscribe(
                    (evento) => {
                        this.Actualizar();
                        this.evento = evento;
                        const tipo = this._login_.Tipo.split('_')[0];
                        this._login_.Revisar_Usuario(tipo, this.evento.Estatus || '');
                        this.menu_items = [
                            {
                                id: menu.nav[0].id,
                                label: menu.nav[0].label,
                                icon: menu.nav[0].icon,
                                btn: menu.nav[0].btn,
                                visible: menu.nav[0].visible,
                                evento: this.Actualizar
                            }
                        ];

                        //Botones que van en la parte de daños
                        if (tipo === 'Normativo') {
                            this.menu_items.push({
                                id: menu.nav[6].id,
                                label: menu.nav[6].label,
                                icon: menu.nav[6].icon,
                                btn: menu.nav[6].btn,
                                visible: !this._login_.EsUsuarioSoloLectura,
                                evento: this.Autorizar,
                            });
                            const visible = this._db_api_.Evento_Autorizado(
                                evento.Estatus || '',
                                this._login_.Sector
                            );
                            this.menu_items.push({
                                id: menu.nav[2].id,
                                label: menu.nav[2].label,
                                icon: menu.nav[2].icon,
                                btn: menu.nav[2].btn,
                                visible: visible,
                                evento: this.Definitivo,
                            });
                            this.menu_items.push({
                                id: menu.nav[7].id,
                                label: menu.nav[7].label,
                                icon: menu.nav[7].icon,
                                btn: menu.nav[7].btn,
                                visible: visible,
                                evento: this.Descargar_A_Excel_Def,
                            });
                        }
                        if (!this._login_.EsUsuarioSoloLectura) {
                            this.btns_items = [
                                {
                                    id: 0,
                                    label: menu.btn[0].label,
                                    icon: menu.btn[0].icon,
                                    btn: menu.btn[0].btn,
                                    visible: menu.btn[0].visible,
                                    evento: this.Edit_Loss,
                                },
                                {
                                    id: 0,
                                    label: menu.btn[4].label,
                                    icon: menu.btn[4].icon,
                                    btn: menu.btn[4].btn,
                                    visible: menu.btn[4].visible,
                                    evento: this.View_More,
                                },
                                {
                                    id: 0,
                                    label: menu.btn[1].label,
                                    icon: menu.btn[1].icon,
                                    btn: menu.btn[1].btn,
                                    visible: menu.btn[1].visible,
                                    evento: this.Save_Loss,
                                },
                                {
                                    id: 0,
                                    label: menu.btn[2].label,
                                    icon: menu.btn[2].icon,
                                    btn: menu.btn[2].btn,
                                    visible: menu.btn[2].visible,
                                    evento: this.Delete_Loss,
                                },
                                {
                                    id: 0,
                                    label: menu.btn[3].label,
                                    icon: menu.btn[3].icon,
                                    btn: menu.btn[3].btn,
                                    visible: menu.btn[3].visible,
                                    evento: this.Cancel_Loss,
                                },
                            ];
                        }
                        const sector_pais = `_${this._login_.config.pais_abrv}_${this._login_.Sector}_`;
                        const has_filter = _PAIS_FILTRO_SECTOR_[sector_pais];
                        // console.log(sector_pais, has_filter);

                        if (has_filter) {
                            this.menu_items.push({
                                id: menu.nav[8].id,
                                label: menu.nav[8].label,
                                icon: menu.nav[8].icon,
                                btn: menu.nav[8].btn,
                                visible: menu.nav[8].visible,
                                evento: this.Reporte_Filtro,
                            });
                        }
                        this.menu_items.push({
                            id: menu.nav[1].id,
                            label: menu.nav[1].label,
                            icon: menu.nav[1].icon,
                            btn: menu.nav[1].btn,
                            visible: menu.nav[1].visible,
                            evento: this.Preliminar,
                        });
                        this.menu_items.push({
                            id: menu.nav[3].id,
                            label: menu.nav[3].label,
                            icon: menu.nav[3].icon,
                            btn: menu.nav[3].btn,
                            visible: menu.nav[3].visible,
                            evento: this.Descargar_A_Excel,
                        });
                        this.menu_items.push({
                            id: menu.nav[4].id,
                            label: menu.nav[4].label,
                            icon: menu.nav[4].icon,
                            btn: menu.nav[4].btn,
                            visible: menu.nav[4].visible,
                            evento: this.Mostrar_Mapa,
                        });
                        this.menu_items.push({
                            id: menu.nav[5].id,
                            label: menu.nav[5].label,
                            icon: menu.nav[5].icon,
                            btn: menu.nav[5].btn,
                            visible: menu.nav[5].visible,
                            evento: this.Cerrar_Sesion,
                        });
                    },
                    (err) => {
                        this._alert_.Close();
                        console.error(err);
                    }
                );
            },
            (err) => {
                this._alert_.ShowWait('Error', err.Message, 'error');
                console.error(err);
            }
        );
    }
    //#endregion

    //#region [Comments]: Name-> Evalua_Captura
    private Get_IData = (name: string): IData =>
        this.items_headers.find((f) => f.campo === name) || {
            campo: '',
            alias: ''
        };

    public Evalua_Loss(_diag_: IDiags): HayError {
        const DIVADMIN1: IData = this.Get_IData('DIVADMIN1');
        DIVADMIN1.value = _diag_.DIVADMIN1;

        const DIVADMIN2: IData = this.Get_IData('DIVADMIN2');
        DIVADMIN2.value = _diag_.DIVADMIN2;

        const DIVADMIN3: IData = this.Get_IData('DIVADMIN3');
        DIVADMIN3.value = _diag_.DIVADMIN3;

        const Localidad: IData = this.Get_IData('Localidad');
        Localidad.value = _diag_.Localidad;

        const Domicilio: IData = this.Get_IData('Domicilio');
        Domicilio.value = _diag_.Domicilio;

        const TipoAdmin: IData = this.Get_IData('TipoAdmin');
        TipoAdmin.value = _diag_.TipoAdmin;

        const Nivel: IData = this.Get_IData('Nivel');
        Nivel.value = _diag_.Nivel;

        const PoblacionAfectada: IData = this.Get_IData('PoblacionAfectada');
        PoblacionAfectada.value = _diag_.PoblacionAfectada;

        const FechaSiembra: IData = this.Get_IData('FechaSiembra');
        FechaSiembra.value = _diag_.FechaSiembra;

        const FiltroClave: IData = this.Get_IData('FiltroClave');
        FiltroClave.value = _diag_.FiltroClave;

        const Clave: IData = this.Get_IData('Clave');
        Clave.value = _diag_.Clave;

        const InfraDa: IData = this.Get_IData('InfraDa');
        InfraDa.value = _diag_.Clave;

        const UnidadMedida: IData = this.Get_IData('UnidadMedida');
        UnidadMedida.value = _diag_.UnidadMedida;

        const AreaTerreno: IData = this.Get_IData('AreaTerreno');
        AreaTerreno.value = _diag_.AreaTerreno;

        const AguaPotable: IData = this.Get_IData('AguaPotable');
        AguaPotable.value = _diag_.AguaPotable;

        const Drenaje: IData = this.Get_IData('Drenaje');
        Drenaje.value = _diag_.Drenaje;

        const Energia: IData = this.Get_IData('Energia');
        Energia.value = _diag_.Energia;

        const ZonaAfectada: IData = this.Get_IData('ZonaAfectada');
        ZonaAfectada.value = _diag_.ZonaAfectada;

        const Foto1: IData = this.Get_IData('Foto1');
        Foto1.value = _diag_.Foto1;

        const Foto2: IData = this.Get_IData('Foto2');
        Foto2.value = _diag_.Foto2;

        const Foto3: IData = this.Get_IData('Foto3');
        Foto3.value = _diag_.Foto3;

        const Foto4: IData = this.Get_IData('Foto4');
        Foto4.value = _diag_.Foto4;

        const Responsable: IData = this.Get_IData('Responsable');
        Responsable.value = _diag_.Responsable;

        const TipoDanio: IData = this.Get_IData('TipoDanio');
        TipoDanio.value = _diag_.TipoDanio;

        const CES1: IData = this.Get_IData('CES1');
        CES1.value = _diag_.CES1;

        const Diagnostico: IData = this.Get_IData('Diagnostico');
        Diagnostico.value = _diag_.Diagnostico;

        const Restauracion: IData = this.Get_IData('Restauracion');
        Restauracion.value = _diag_.Restauracion;

        const Unidades: IData = this.Get_IData('Unidades');
        Unidades.value = _diag_.Unidades;

        const CostoUnitario: IData = this.Get_IData('CostoUnitario');
        CostoUnitario.value = _diag_.CostoUnitario;

        const CostoTotalObra: IData = this.Get_IData('CostoTotalObra');
        CostoTotalObra.value = _diag_.CostoTotalObra;

        const CostoAdmin: IData = this.Get_IData('CostoAdmin');
        CostoAdmin.value = _diag_.CostoAdmin;

        const CostoTotalR: IData = this.Get_IData('CostoTotalR');
        CostoTotalR.value = _diag_.CostoTotalR;

        const Observaciones: IData = this.Get_IData('Observaciones');
        Observaciones.value = _diag_.Observaciones;

        return this._db_api_.Validar_Datos([
            Localidad,
            Domicilio,
            TipoAdmin,
            Nivel,
            PoblacionAfectada,
            FechaSiembra,
            Clave,
            UnidadMedida,
            AreaTerreno,
            TipoDanio,
            Diagnostico,
            Restauracion,
            Unidades,
            CostoUnitario,
            CostoTotalObra,
            CostoAdmin,
            CostoTotalR
        ], 'revision');
    }
    //#endregion
}
