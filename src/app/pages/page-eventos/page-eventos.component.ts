/** [# version: 7.5.23 #] */
import { Component, OnInit, ViewChild } from '@angular/core';
import { HayError } from 'src/app/class/hay-error';
import { IDiags } from 'src/app/class/interfaces/diags.interface';
import { IEvento } from 'src/app/class/interfaces/evento.interface';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { IMenu } from 'src/app/class/interfaces/menu.interface';
import { IData } from 'src/app/class/interfaces/plantilla.interface';
import { BvsuiteCreateFilterComponent } from 'src/app/components/shared/Biblioteca/bvsuite-create-filter/bvsuite-create-filter.component';
import { DynamicTableComponent } from 'src/app/components/tools/dynamic-table/dynamic-table.component';
import { ToolListaSectoresComponent } from 'src/app/components/tools/tool-lista-sectores/tool-lista-sectores.component';
import { PATH_ } from 'src/app/global/globals';
import { AlertsService } from 'src/app/services/alerts.service';
import { DbapiService } from 'src/app/services/dbapi.service';
import { DownloadService } from 'src/app/services/download.service';
import { LangService } from 'src/app/services/lang.service';
import { LoginService } from 'src/app/services/login.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-page-eventos',
  templateUrl: './page-eventos.component.html',
  styleUrls: ['./page-eventos.component.css'],
})
export class PageEventosComponent implements OnInit {
  //#region [Propiedades]:
  menu_items: Array<IMenu> = [];
  btns_items: Array<IMenu> = [];
  items: Array<IDiags> = [];
  items_headers: Array<IData> = [];
  editar: boolean = false;
  evento: IEvento = {};
  IDEvento: number = 0;
  IDData: string = '';
  modulo: string = '';
  // @ts-ignore
  @ViewChild(DynamicTableComponent) table: DynamicTableComponent;
  @ViewChild(ToolListaSectoresComponent) //@ts-ignore
  lst_sectores: ToolListaSectoresComponent;
  // @ts-ignore
  @ViewChild(BvsuiteCreateFilterComponent) filter: BvsuiteCreateFilterComponent;
  language!: iModuleLang;
  //#endregion

  //#region [OnInit]: Name-> Constructor
  constructor(
    private _alert_: AlertsService,
    private _download_: DownloadService,
    private _navigate_: NavigationService,
    private _db_api_: DbapiService,
    private _login_: LoginService,
    private _lang_: LangService
  ) {}

  ngOnInit(): void {
    this.modulo = this._login_.Define_modulo('eventos');
    // Para activar el json de lenguaje:
    // ~1. EL módulo
    this._lang_.modulo = 'eventos';
    // ~2. La mima línea para cada módulo
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
    let func: IMenu | null =
      this.menu_items.find((f) => f.label === _item_name_) ?? null;
    if (func === null) {
      func = this.btns_items.find((f) => f.label === _item_name_) ?? {
        label: '',
        icon: '',
        btn: '',
        evento: this.NoneEvent,
      };
    }
    if (func.evento) func.evento(args);
  };
  //#endregion

  //#region [Function]:  Name-> Items Menú
  Nuevo = () => {
    if (this.editar) {
      this._alert_.FireToastOwn(
        this.language.actualmente_edicion,
        'warning',
        'warning'
      );
      return;
    }
    const now = new Date();
    const nuevo_item: IDiags = {
      Autoriza: '',
      Eliminado: '0',
      Estatus: '',
      FechaCreacion: '2020-11-25T14:04:07.7',
      FechaEvento: this._db_api_.Get_Date(now),
      FechaModificacion: '2021-02-16T09:11:08.803',
      Fenomeno: '',
      IDEvento: '0',
      Nombre: '',
    };
    this.items.splice(0, 0, nuevo_item);
    this._db_api_.btn_items_group.splice(0, 0, this.btns_items);
    this.IDEvento = 0;
    this._db_api_.Btns_Edition(0);
    
    if (this.table) this.table.Change_Items(0);
    this.editar = true;
    //Cambio a edición
  };
  Actualizar = () => {
    if (this.editar) {
      this._alert_.FireToastOwn(
        this.language.actualmente_edicion,
        'warning',
        'warning'
      );
      return;
    }
    this.items = [];

    this._alert_.SetLoading = this.language.leyendo_eventos;
    this._db_api_.Get_Eventos().subscribe(
      (eventos) => {
        // Todo-> Tarea por hacer
        this.items_headers = [
          {
            editable: false,
            tipo: 'text',
            estatus: 'web',
            campo: 'IDEvento',
            alias: this.language.clave,
            
          },
          {
            editable: true,
            tipo: 'text',
            estatus: 'web',
            campo: 'Fenomeno',
            alias: this.language.nombre_fenomeno,
            required: '>',
          },
          {
            editable: true,
            tipo: 'text',
            estatus: 'web',
            campo: 'Nombre',
            alias: this.language.nombre,
          },
          {
            editable: true,
            tipo: 'date',
            estatus: 'web',
            campo: 'FechaEvento',
            alias: this.language.fecha_evento,
            required: '<',
            formato: 'date',
          },
          {
            editable: true,
            tipo: 'text',
            estatus: 'web',
            campo: 'Autoriza',
            alias: this.language.autorizado_por,
            required: '>',
          },

          // { campo: 'Eliminado', alias: '' },
          // { campo: 'Estatus', alias: '' },
          // { campo: 'FechaCreacion', alias: '' },
          // { campo: 'FechaModificacion', alias: '' },
        ];
        // console.log(this.items_headers);
        this.items = eventos;
        this._alert_.Close();

        // console.log(eventos);
      },
      (err) => {
        this._alert_.Close();
        this._alert_.FireToast(
          err.error.Message ?? this.language.no_se_pudo_realizar_conexion,
          'error'
        );
        console.log(err);
      }
    );
  };
  /**
   * @name Solo sirve para mostrar un mensaje por si el item no tiene
   *   relacionado un evento
   */
  NoneEvent = (): void => {
    this._alert_.ShowWait(this.language.item_no_relacionado_evento, '');
  };
  //#endregion

  //#region [Function]: Name-> Buttons items
  /**
   * @description Verifica si se está editando o agregando un evento y manda una alerta
   * @returns Si se está editando o agregando un elemento
   */
  // private Esta_Editando_Otro_Item_ = (): boolean => {
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
  //           // Todo->
  //           // ~1. Recuperar el IDEvento del otro elemento
  //           const grupo = this._db_api_.btn_items_group.filter(
  //             (g) => g.find((f) => f.label === 'edit')?.visible === false
  //           )[0];
  //           // ~2. Guardar la información
  //           const id = grupo[0].id || 0;
  //           this.Save_Evento(['guardar', id.toString(), 'ContinuarEditando']);
  //           // ~3. Cambiar al nuevo elemento
  //         }
  //       });
  //     return true;
  //   }

  //   return false;
  // };
  /**
   * @description Prepara la información para editar el evento
   * @param args Recibe el idevento y el nombre del botón
   * @returns none
   */
  Edit_Evento = (args: Array<string>): void => {
    if (this.editar) {
      this._alert_.FireToastOwn(
        this.language.actualmente_edicion,
        'warning',
        'warning'
      );
      return;
    }
    this.IDEvento = Number(args[1]);
    //Obtiene el item por ID
    let diag: IDiags = this.Get_Diag(args[1]);
    this.table.diag_temp = { ...diag };

    this.editar = true;
    this._db_api_.Btns_Edition(this.IDEvento);
  };
  /**
   * @description Pregunta al usuario si desea eliminar el elemento
   * @param args Recibe el idevento y el nombre del botón
   */
  Delete_Evento = (args: Array<string>): void => {
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
        this.language.desactivar_evento,
        `<span class="text-danger">${this.language.desactivar_evento}</span>`
      )
      .then((choice: string) => {
        if (choice === 'ok') {
          this._alert_.SetLoading = this.language.enviando_info;
          //Recupera el item
          let _evento_: IDiags = this.Get_Diag(args[1]);

          if (_evento_.Eliminado === '1') _evento_.Eliminado = '0';
          else _evento_.Eliminado = '1';

          this._db_api_.Save_Evento(_evento_).subscribe(
            (resultado) => {
              // console.log(resultado);
              this._alert_.ShowWait(
                this.language.desactivado,
                resultado.Descripcion
              );
            },
            (err) => {
              console.log(err);
              this._alert_.FireToast(
                err.Message ?? this.language.no_se_pudo_realizar_conexion,
                'error'
              );
            }
          );
        }
      });
  };
  /**
   * @description Prepara los datos para ser enviados a la api y guardar los cambios
   * @param args Recibe el idevento y el nombre del botón
   */
  Save_Evento = (args: Array<string>): void => {
    // this._alert_.SetLoading = 'Enviando información...';
    //Recupera el item
    let _evento_: IDiags = this.Get_Diag(args[1]);

    //Evaluar Evento
    const hay_error = this.Evalua_Evento(_evento_);
    if (hay_error.Hay_Error) {
      this._alert_.FireToast(hay_error.Mensaje, 'error');
      return;
    }
    this._alert_.SetLoading = this.language.guardar_evento;
    this._db_api_.Save_Evento(_evento_).subscribe(
      (resultado) => {
        // Todo-> Tarea por hacer
        // console.log(resultado);
        this.editar = false;
        _evento_.IDEvento = resultado.IDActivo.toString();
        this._alert_.ShowWait(this.language.guardar, resultado.Descripcion);
        this._db_api_.Set_Btns_Edition_ID(resultado.IDActivo);
        this._db_api_.Btns_Edition(resultado.IDActivo);
        // console.log(this._db_api_.btn_items_group);
      },
      (err) => {
        console.error(err);
        this._alert_.FireToast(
          err.Message ?? this.language.no_se_pudo_realizar_conexion,
          'error'
        );
      }
    );
  };
  /**
   * @description Pregunta al usuario y se cancela la edición o el agregado del evento
   * Se elimina el nuevo evento de items y el grupo de botones de btn_items_group
   * @param args recibe el idevento y el nombre del botón
   */
  Cancel_Evento = (args: Array<string>): void => {
    if (this.IDEvento === 0) {
      this._alert_
        .Confirm(
          this.language.cancelar_nuevo_elemento,
          `<span class="text-danger">${this.language.cancelar_nuevo_elemento_2}</span>`
        )
        .then((choice: string) => {
          if (choice === 'ok') {
            this.editar = false;
            this._db_api_.btn_items_group.splice(0, 1);
            this.items.splice(0, 1);
            this.table.Change_Items(0);
          }
        });
    } else {
      this._alert_
        .Confirm(
          this.language.cancelar_edicion,
          `<span class="text-danger">${this.language.cancelar_edicion_2}</span>`
        )
        .then((choice: string) => {
          if (choice === 'ok') {
            // Regresa los datos originales
            this.editar = false;
            this._db_api_.Btns_Edition(Number(args[1]));
            this.table.Set_Items_OnShow_ByID_(args[1], 'IDEvento');
          }
        });
    }
  };
  /**
   *@description obtiene la información de las capturas con el IDEvento y el 
  Sector, si el usuario es Administrador se muestra un modal con la lista de
  sectores que puede consultar
   * @returns
   */
  Show_Losses = (args: Array<string>) => {
    // console.log(args[1], this._login_.Tipo);
    if (this._login_.Get_Tipo() !== 'Normativo') {
      this.lst_sectores.On_Show(args, PATH_._REVISION_);
    } else this.Get_Losses(args[1], this._login_.Sector, PATH_._REVISION_);
  };
  Get_Losses = (_id_evento_: string, _sector_: number, _path_: string) => {
    this._db_api_.Get_Usuario_X_Evento(Number(_id_evento_), _sector_).subscribe(
      (usuario) => {
        if (usuario) {
          // console.log(usuario);
          this._login_.IDUsuario_Captura = usuario.IDUsuario;
          this._login_.Sector_Captura = usuario.Sector || 0;
          this._login_.IDEvento_Captura = usuario.IDEvento || 0;
          this._login_.FechaExpira_Captura = new Date(
            String(usuario.FechaExpira)
          );
          this._login_.Caducado_Captura = this._login_.Revisar_Caducidad(
            new Date(String(usuario.FechaExpira))
          );
          this._navigate_.Next_View = { path: _path_ };
        } else {
          this._alert_.FireToastOwn(
            this.language.evento_sin_capturas,
            'info',
            'info-circle'
          );
        }
      },
      (err) => {
        console.error(err);
        this._alert_.FireToast(
          err.Message ?? this.language.no_se_pudo_realizar_conexion,
          'error'
        );
      }
    );
  };
  On_Item_Sector_Select = (args: Array<string>) =>
    this.Get_Losses(args[1], Number(args[0]), args[2]);
  /**
   * @description Muestra los indicadores pero tiene la misma lógica que
   * showlosses
   * @returns
   */
  Show_Indicadores = (args: Array<string>) => {
    if (this._login_.Get_Tipo() !== 'Normativo') {
      this.lst_sectores.On_Show(args, PATH_._INDICADORES_);
    } else this.Get_Losses(args[1], this._login_.Sector, PATH_._INDICADORES_);
  };
  /**
   * @description Cierra la sesión redirigiendo al componente Cerrar sesión
   * @returns
   */
  Cerrar_Sesion = () =>
    this._alert_.Confirm(this.language.cerrar_sesion).then((choice: string) => {
      if (choice === 'ok') {
        this._navigate_.Next_View = { path: PATH_._CERRAR_SESION_ };
      }
    });
  //#endregion

  //#region [Function]: Name-> Crea_Menu
  Crea_Menu = () => {
    this._download_.Get_Json_Menus('eventos').subscribe(
      (menu) => {
        // Todo-> Generar los menús
        this.menu_items = [
          {
            label: menu.nav[0].label,
            icon: menu.nav[0].icon,
            btn: menu.nav[0].btn,
            visible: this._login_.Has('EveNew') as boolean,
            evento: this.Nuevo,
          },
          {
            label: menu.nav[1].label,
            icon: menu.nav[1].icon,
            btn: menu.nav[1].btn,
            visible: menu.nav[1].visible,
            evento: this.Actualizar,
          },
          {
            label: menu.nav[2].label,
            icon: menu.nav[2].icon,
            btn: menu.nav[2].btn,
            visible: menu.nav[2].visible,
            evento: this.Cerrar_Sesion,
          },
        ];
        //Botones que van en la parte de daños
        /** Si bloqueas el botón de editar, estos no aparecen tampoco */
        this.btns_items = [
          {
            id: 0,
            label: menu.btn[1].label,
            icon: menu.btn[1].icon,
            btn: menu.btn[1].btn,
            visible: menu.btn[1].visible,
            evento: this.Save_Evento,
          },
          {
            id: 0,
            label: menu.btn[3].label,
            icon: menu.btn[3].icon,
            btn: menu.btn[3].btn,
            visible: menu.btn[3].visible,
            evento: this.Cancel_Evento,
          },
        ];

        if (this._login_.Has('EveEdi')) {
          this.btns_items.push({
            id: 0,
            label: menu.btn[0].label,
            icon: menu.btn[0].icon,
            btn: menu.btn[0].btn,
            visible: menu.btn[0].visible,
            evento: this.Edit_Evento,
          });
        }

        if (this._login_.Has('EveDel')) {
          this.btns_items.push({
            id: 0,
            label: menu.btn[2].label,
            icon: menu.btn[2].icon,
            btn: menu.btn[2].btn,
            visible: menu.btn[2].visible,
            evento: this.Delete_Evento,
          });
        }

        if (this._login_.Has('EveCap')) {
          this.btns_items.push({
            id: 0,
            label: menu.btn[4].label,
            icon: menu.btn[4].icon,
            btn: menu.btn[4].btn,
            visible: menu.btn[4].visible,
            evento: this.Show_Losses,
          });
        }

        if (this._login_.Has('EveCap')) {
          this.btns_items.push({
            id: 0,
            label: menu.btn[5].label,
            icon: menu.btn[5].icon,
            btn: menu.btn[5].btn,
            visible: menu.btn[5].visible,
            evento: this.Show_Indicadores,
          });
        }

        this._alert_.SetLoading = this.language.leyendo_lista_eventos;

        this.Actualizar();
      },
      (err) => {
        // Warning-> Capturar el error
        console.log(err);
      }
    );
  };
  //#endregion

  //#region [Function]: Name-> Evalua_Evento
  private Get_IData = (name: string): IData =>
    this.items_headers.find((f) => f.campo === name) || {
      campo: '',
      alias: '',
    };
  private Get_Diag = (_id_: string): IDiags =>
    this.items.filter((item) => Number(item['IDEvento']) === Number(_id_))[0];

  public Evalua_Evento(_evento_: IEvento): HayError {
    const Fenomeno: IData = this.Get_IData('Fenomeno');
    Fenomeno.value = _evento_.Fenomeno;

    const FechaEvento: IData = this.Get_IData('FechaEvento');
    FechaEvento.value = _evento_.FechaEvento;

    const Autoriza = this.Get_IData('Autoriza');
    Autoriza.value = _evento_.Autoriza;

    const Nombre = this.Get_IData('Nombre');
    Nombre.value = _evento_.Nombre;

    return this._db_api_.Validar_Datos(
      [Fenomeno, Nombre, FechaEvento, Autoriza],
      'eventos'
    );
  }
  //#endregion
}
