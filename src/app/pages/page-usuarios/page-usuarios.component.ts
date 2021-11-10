/** [# version: 7.5.14 #] */
import { Component, OnInit, ViewChild } from '@angular/core';
import { HayError } from 'src/app/class/hay-error';
import {
  ICatalogo,
  ISectores,
} from 'src/app/class/interfaces/catalogo.interface';
import { IDiags } from 'src/app/class/interfaces/diags.interface';
import { IEvento } from 'src/app/class/interfaces/evento.interface';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { IMenu } from 'src/app/class/interfaces/menu.interface';
import { IPerfiles } from 'src/app/class/interfaces/perfiles.interface';
import { IData } from 'src/app/class/interfaces/plantilla.interface';
import { BvsuiteCreateFilterComponent } from 'src/app/components/shared/Biblioteca/bvsuite-create-filter/bvsuite-create-filter.component';
import { DynamicTableComponent } from 'src/app/components/tools/dynamic-table/dynamic-table.component';
import { PATH_ } from 'src/app/global/globals';
import { AlertsService } from 'src/app/services/alerts.service';
import { CatalogosService } from 'src/app/services/catalogos.service';
import { DbapiService } from 'src/app/services/dbapi.service';
import { DownloadService } from 'src/app/services/download.service';
import { LangService } from 'src/app/services/lang.service';
import { LoginService } from 'src/app/services/login.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-page-usuarios',
  templateUrl: './page-usuarios.component.html',
  styleUrls: ['./page-usuarios.component.css'],
})
export class PageUsuariosComponent implements OnInit {
  //#region [Propiedades]:
  menu_items: Array<IMenu> = [];
  btns_items: Array<IMenu> = [];
  items: Array<IDiags> = [];
  sectores: Array<ISectores> = [];
  perfiles: Array<IPerfiles> = [];
  eventos: Array<IEvento> = [];
  items_headers_editar: Array<IData> = [];
  items_headers_nuevo: Array<IData> = [];
  items_headers: Array<IData> = [];
  editar: boolean = false;
  IDUsuario: number = 0;
  IDData: string = '';
  dias: number = 0;
  modulo: string = '';
  // @ts-ignore
  @ViewChild(DynamicTableComponent) table: DynamicTableComponent;
  // @ts-ignore
  @ViewChild(BvsuiteCreateFilterComponent) filter: BvsuiteCreateFilterComponent;
  language!: iModuleLang;
  //#endregion

  //#region [OnInit]: Name-> Constructor, oninit
  constructor(
    private _alert_: AlertsService,
    private _download_: DownloadService,
    private _db_api_: DbapiService,
    private _navigate_: NavigationService,
    private _catalogos_: CatalogosService,
    private _login_: LoginService,
    private _lang_: LangService
  ) {}

  ngOnInit(): void {
    this.modulo = this._login_.Define_modulo('usuarios');
    // Para activar el json de lenguaje:
    // ~1. EL módulo
    this._lang_.modulo = 'usuarios';
    // ~2. La mima línea para cada módulo
    this.language = this._lang_.language_by_modulo;
    // console.log(this.language);
    this._alert_.Close();
    this.Crea_Menu();
    // console.log(this.modulo);
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

  //#region [Function]: Name-> Get Headers, Set Headers y Get Diag
  /**
   * @description Obtiene los encabezados y separa en headers editar y en
   * headers nuevo para separar correctamente la evaluación de cada usuario
   */
  public Get_Headers = () => {
    // Todo-> Leer los encabezados del json
    this._download_.Get_Json_Usuarios().subscribe(
      (headers) => {
        let headers_nuevo: Array<IData> = [];
        // console.log(headers);
        headers.data.map((h) => {
          headers_nuevo.push({ ...h });
          if (h.editable) {
            //           0.app  1.Editar  2
            //editable: "[false, false, true]"
            let editable_aux = JSON.stringify(h.editable);
            h.editable = JSON.parse(editable_aux)[1];
          }
        });
        headers_nuevo.map((h) => {
          if (h.editable) {
            //           0.app   1     2.Nuevo
            //editable: "[false, false, true]"
            let editable_aux = JSON.stringify(h.editable);
            h.editable = JSON.parse(editable_aux)[2];
          }
          if (h.required_nuevo) {
            h.required = h.required_nuevo;
          } else {
            h.required = undefined;
          }
        });
        this.items_headers_editar = headers.data;
        this.items_headers_nuevo = headers_nuevo;
        this.dias = headers.config.dias;
        this.Set_Headers(false);
      },

      (err) => {
        this._alert_.Close();
        console.error(err);
      }
    );
  };
  /**
   *
   * @param nuevo si hace clic en nuevo o false si hace clic en editar
   */
  Set_Headers = (nuevo: boolean = true) => {
    this.items_headers = [];
    if (nuevo) {
      this.items_headers = this.items_headers_nuevo;
    } else {
      this.items_headers = this.items_headers_editar;
    }
  };
  /**
   * @description Obtiene el usuario por id
   * @param _id_ Identificador del usuario
   * @returns
   */
  Get_Diag = (_id_: string) =>
    this.items.filter((item) => Number(item['IDUsuario']) === Number(_id_))[0];
  //#endregion

  //#region [Function]: Name-> Get Catalogos
  /**
   * @description Obtiene los catálogos de Sectores, Perfiles y Eventos.
   */
  Get_List_Sectores = () =>
    new Promise((resolve, reject) => {
      this._db_api_.Get_Sectores().subscribe(
        (sectores) => resolve(sectores),
        (err) => reject(err)
      );
    });

  Get_List_Perfiles = () =>
    new Promise((resolve, reject) => {
      this._db_api_.Get_Perfiles().subscribe(
        (perfiles) => resolve(perfiles),
        (err) => reject(err)
      );
    });

  Get_List_Eventos = () =>
    new Promise((resolve, reject) => {
      this._db_api_.Get_Eventos().subscribe(
        (eventos) => resolve(eventos),
        (err) => reject(err)
      );
    });
  /**
   * @description Después de obtener los catálgos los asigna a través de
   * CatalogosService -> New_Item
   * @param diag item usuario al que se le asignarán los catálogos
   */
  Get_Catalogos = async (diag: IDiags): Promise<void> => {
    this._alert_.SetLoading = this.language.preparando_info;
    try {
      this.sectores = (await this.Get_List_Sectores()) as Array<ISectores>;
    } catch (e: any) {
      console.log(e);
      this._alert_.FireToast('', 'error');
      return;
    }
    let _cat_: Array<ICatalogo> = [];
    for (const sector of this.sectores) {
      const cat_sector: ICatalogo = {
        ID: 0,
        Grupo: 'Sector',
        Valor: sector.AbrevMin,
        Descripcion: String(sector.ID),
        Sectores: '',
      };
      _cat_.push(cat_sector);
    }
    this._catalogos_.New_Item('Sector', _cat_);
    //console.log(this._catalogos_);

    this.perfiles = (await this.Get_List_Perfiles()) as Array<IPerfiles>;
    _cat_ = [];
    for (const perfil of this.perfiles) {
      const cat_perfil: ICatalogo = {
        ID: 0,
        Grupo: 'Perfil',
        Valor: perfil.Descripcion,
        Descripcion: String(perfil.IDPerfil),
        Sectores: '',
      };
      _cat_.push(cat_perfil);
    }

    this._catalogos_.New_Item('Perfil', _cat_);
    try {
      this.eventos = (await this.Get_List_Eventos()) as Array<IEvento>;
    } catch (e) {
      console.log(e);
      this._alert_.FireToast('', 'error');
      return;
    }
    _cat_ = [];
    for (const evento of this.eventos) {
      if (evento.Eliminado) continue;
      const cat_evento: ICatalogo = {
        ID: 0,
        Grupo: 'Evento',
        Valor: `${evento.Fenomeno} ${evento.Nombre} [${evento.FechaEvento}]`,
        Descripcion: String(evento.IDEvento),
        Sectores: '',
      };
      _cat_.push(cat_evento);
      this._alert_.Close();
    }

    this._catalogos_.New_Item('Evento', _cat_);

    for (const h of this.items_headers) {
      if (h.lista) {
        const lista = h.lista.split('|');
        if (lista.length === 1 && this._catalogos_.Get_Item(h.lista)) {
          diag[`${h.lista}_lista`] = this._catalogos_
            .Get_Item(h.lista)
            .map((item) => item.Valor)
            .join('|');
        } else {
          // for (let item of lista) {
          diag[`${h.campo}_lista`] = h.lista;
          // }
        }
      }
    }
  };
  //#endregion

  //#region [Function]:  Name-> Items Menú
  /**
   * @description Agrega un nuevo elemento para crear un nuevo usuario. Inserta
   * en la posición cero de items
   */
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
      Apellidos: '',
      Cargo: '',
      Correo: '',
      Descripcion: '',
      FechaCreada: this._db_api_.Get_Date(now),
      FechaExpira: this._db_api_.Set_Expiration_Date(now, this.dias),
      IDUsuario: '0',
      IDEvento: '0',
      IDPerfil: '0',
      LimiteSesiones: '10',
      Nombre: '',
      NomSector: '',
      NomUsuario: '',
      Password: this._db_api_.Generate_Password(10),
      Tipo: '0',
      Sector: '0',
    };
    this.items.splice(0, 0, nuevo_item);
    // console.log(this._db_api_.btn_items_group.length);
    if (this._db_api_.btn_items_group.length) {
      const btns_items: Array<IMenu> = [];
      for (const b of this.btns_items) btns_items.push({ ...b });

      this._db_api_.btn_items_group.splice(0, 0, btns_items);
    } else this._db_api_.btn_items_group.splice(0, 0, this.btns_items);
    this.IDUsuario = 0;
    this._db_api_.Btns_Edition(0);
    this.Set_Headers();
    this.Get_Catalogos(nuevo_item);

    // console.log(this._catalogos_.Data);
    // console.log(this._db_api_.btn_items_group);
    if (this.table) this.table.Change_Items(0);
    this.editar = true;
  };
  /**
   * @description Actuliza la información pero deve estar el items limpio antes
   * de invocar la api
   * @returns
   */
  Actualizar = () => {
    if (this.editar) {
      this._alert_.FireToastOwn(
        this.language.actualmente_edicion,
        'warning',
        'warning'
      );
      return;
    }
    this._alert_.SetLoading = this.language.leyendo_usuarios;
    this.items = [];
    this._db_api_.Get_Usuario(0).subscribe(
      (usuarios) => {
        this.Get_Headers();
        // console.log(usuarios);
        this.items = usuarios;
        this._alert_.Close();
      },
      (err) => console.error(err)
    );
  };
  /**
   * @name Solo sirve para mostrar un mensaje por si el item no tiene
   *   relacionado un evento
   */
  NoneEvent = (): void => {
    this._alert_.ShowWait(this.language.item_no_relacionado_evento, '');
  };
  /**
   * @description Cierra la sesión invocando el path _CERRAR_SESION_
   * @returns
   */
  Cerrar_Sesion = () =>
    this._alert_.Confirm(this.language.cerrar_sesion).then((choice: string) => {
      if (choice === 'ok') {
        this._navigate_.Next_View = { path: PATH_._CERRAR_SESION_ };
      }
    });
  //#endregion

  //#region [Function]: Name-> Items btns, Edit, Delete, Save, Cancel
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
  //           // ~1. Recuperar el IDUsuario del otro elemento
  //           const grupo = this._db_api_.btn_items_group.filter(
  //             (g) => g.find((f) => f.label === 'edit')?.visible === false
  //           )[0];
  //           // ~2. Guardar la información
  //           const id = grupo[0].id || 0;
  //           this.Save_Usuario(['guardar', id.toString(), 'ContinuarEditando']);
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
  Edit_Usuario = (args: Array<string>) => {
    if (this.editar) {
      this._alert_.FireToastOwn(
        this.language.actualmente_edicion,
        'warning',
        'warning'
      );
      return;
    }
    this.IDUsuario = Number(args[1]);

    //Obtiene el item por IDAccion
    let diag: IDiags = this.Get_Diag(args[1]);
    this.table.diag_temp = { ...diag };
    this.Get_Catalogos(diag);
    this.Set_Headers(false);
    this._db_api_.Btns_Edition(this.IDUsuario);
    this.editar = true;
  };

  Delete_Usuario = (args: Array<string>): void => {
    this._alert_
      .Confirm(
        this.language.borrar_usuario,
        `<span class="text-danger">${this.language.borrar_usuario_2}</span>`
      )
      .then((choice: string) => {
        if (choice === 'ok') {
          this._alert_.SetLoading = this.language.eliminando;
          // console.log(args);
          this._db_api_.Delete_Usuario(Number(args[1])).subscribe(
            (resultado) => {
              // console.log(resultado);
              this._alert_.ShowWait(
                this.language.eliminado,
                resultado.Descripcion
              );

              this.Actualizar();
            },
            (err) => {
              console.log(err);
              this._alert_.Close();
              this._alert_.FireToast(this.language.capturas_asociadas, 'error');
            }
          );
          this.editar = false;
        }
      });
  };
  /**
   * @description Prepara los datos para ser enviados a la api y guardar los cambios
   * @param args Recibe el idevento y el nombre del botón
   */
  Save_Usuario = (args: Array<string>): void => {
    //this._alert_.SetLoading = 'Enviando información...';
    //Recupera el item
    let _usuario_: IDiags = this.items.filter(
      (item, i) => Number(item['IDUsuario']) === Number(args[1])
    )[0];
    // console.log(this._catalogos_.Data);
    _usuario_.IDEvento = this._catalogos_.Get_From_Clave(
      _usuario_.IDEvento,
      'Evento',
      _usuario_.IDEvento === '0' // Nota-> Si no usó el select del evento
    )?.Descripcion!;
    _usuario_.IDPerfil = this._catalogos_.Get_From_Clave(
      _usuario_.Tipo,
      'Perfil',
      _usuario_.Tipo === '0' // Nota-> Si no usó el select del perfil
    )?.Descripcion!;
    _usuario_.Sector = this._catalogos_.Get_From_Clave(
      _usuario_.Sector,
      'Sector',
      _usuario_.Sector === '0' // Nota-> Si no usó el select del sector
    )?.Descripcion!;
    // _usuario_.Tipo = this._catalogos_.Get_From_Clave(
    //   _usuario_.Tipo,
    //   'Tipo',
    //   _usuario_.Tipo === '0' // Nota-> Si no usó el select del Tipo
    // )?.Descripcion!;

    //Evaluar Usuario
    const hay_error = this.Evalua_Evento(_usuario_);
    if (hay_error.Hay_Error) {
      this._alert_.FireToast(hay_error.Mensaje, 'error');
      return;
    }
    // console.log(_usuario_);
    this._alert_.SetLoading = this.language.guardar_usuario;
    this._db_api_.Save_Usuario(_usuario_).subscribe(
      (resultado) => {
        // Todo-> Tarea por hacer
        // console.log(resultado);
        this._alert_.ShowWait(this.language.guardar, resultado.Descripcion);
        if (resultado.Tipo !== 'Error') {
          this.editar = false;
          _usuario_.IDUsuario = resultado.ID.toString();
          this._db_api_.Set_Btns_Edition_ID(resultado.ID);
          this._db_api_.Btns_Edition(resultado.ID);
          // console.log(this._db_api_.btn_items_group);
        }
      },
      (err) => {
        console.log(err);
        this._alert_.Close();
        this._alert_.FireToast(
          err.Message ?? this.language.no_se_pudo_realizar_conexion,
          'error'
        );
      }
    );
    // this._db_api_.Btns_Edition(Number(args[1]));
    this.editar = false;
  };
  /**
   * @description Pregunta al usuario y se cancela la edición o el agregado del evento
   * Se elimina el nuevo evento de items y el grupo de botones de btn_items_group
   * @param args recibe el idevento y el nombre del botón
   */
  Cancel_Usuario = (args: Array<string>): void => {
    if (this.IDUsuario === 0) {
      this._alert_
        .Confirm(
          this.language.cancelar_edicion_1,
          `<span class="text-danger">${this.language.cancelar_edicion_3}</span>`
        )
        .then((choice: string) => {
          if (choice === 'ok') {
            this.editar = false;
            this._db_api_.Btns_Edition(0);
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
            this.table.Set_Items_OnShow_ByID_(args[1], 'IDUsuario');
          }
        });
    }
  };

  //#endregion

  //#region [Function] Name-> Unlock Usuario
  /**
   * @description Desbloquea al Usuario
   * @param args recibe el idevento y el nombre del botón
   */
  Unlock_Usuario = (args: Array<string>): void => {
    let _usuario_: IDiags = this.items.filter(
      (item, i) => Number(item['IDUsuario']) === Number(args[1])
    )[0];
    //this._alert_.SetLoading = 'Desbloqueando usuario...';

    this._alert_.SetLoading = this.language.desbloquear_usuario;

    this._db_api_.Unlock_User(_usuario_).subscribe(
      (resultado) => {
        this._alert_.ShowWait(
          this.language.usuario_desbloqueado,
          resultado.Descripcion
        );
        // Todo-> Tarea por hacer
        // console.log(resultado);
      },
      (err) => {
        console.log(err);
        this._alert_.Close();
        this._alert_.FireToast(
          err.Message ?? this.language.no_se_pudo_realizar_conexion,
          'error'
        );
      }
    );
  };

  //#endregion

  //#region [Function]: Name-> Crea_Menu
  Crea_Menu = () => {
    this._download_.Get_Json_Menus('usuarios').subscribe(
      (menu) => {
        // Todo-> Generar los menús
        this.menu_items = [
          {
            label: menu.nav[0].label,
            icon: menu.nav[0].icon,
            btn: menu.nav[0].btn,
            visible: menu.nav[0].visible,
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
        this.btns_items = [
          {
            id: 0,
            label: menu.btn[0].label,
            icon: menu.btn[0].icon,
            btn: menu.btn[0].btn,
            visible: menu.btn[0].visible,
            evento: this.Edit_Usuario,
          },
          {
            id: 0,
            label: menu.btn[1].label,
            icon: menu.btn[1].icon,
            btn: menu.btn[1].btn,
            visible: menu.btn[1].visible,
            evento: this.Save_Usuario,
          },
          {
            id: 0,
            label: menu.btn[4].label,
            icon: menu.btn[4].icon,
            btn: menu.btn[4].btn,
            visible: menu.btn[4].visible,
            evento: this.Unlock_Usuario,
          },
          {
            id: 0,
            label: menu.btn[2].label,
            icon: menu.btn[2].icon,
            btn: menu.btn[2].btn,
            visible: menu.btn[2].visible,
            evento: this.Delete_Usuario,
          },
          {
            id: 0,
            label: menu.btn[3].label,
            icon: menu.btn[3].icon,
            btn: menu.btn[3].btn,
            visible: menu.btn[3].visible,
            evento: this.Cancel_Usuario,
          },
        ];

        this._alert_.SetLoading = this.language.leyendo_lista_usuarios;

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

  public Evalua_Evento(_usuario_: IDiags): HayError {
    const IDEvento: IData = this.Get_IData('IDEvento');
    IDEvento.value = _usuario_.IDEvento;

    const NomUsuario: IData = this.Get_IData('NomUsuario');
    NomUsuario.value = _usuario_.NomUsuario;

    const Password: IData = this.Get_IData('Password');
    Password.value = _usuario_.Password;

    const LimiteSesiones: IData = this.Get_IData('LimiteSesiones');
    LimiteSesiones.value = _usuario_.LimiteSesiones;

    const FechaExpira: IData = this.Get_IData('FechaExpira');
    FechaExpira.value = _usuario_.FechaExpira;

    const Nombre: IData = this.Get_IData('Nombre');
    Nombre.value = _usuario_.Nombre;

    const Apellidos: IData = this.Get_IData('Apellidos');
    Apellidos.value = _usuario_.Apellidos;

    const Cargo: IData = this.Get_IData('Cargo');
    Cargo.value = _usuario_.Cargo;

    const Correo: IData = this.Get_IData('Correo');
    Correo.value = _usuario_.Correo;

    const Telefono: IData = this.Get_IData('Telefono');
    Telefono.value = _usuario_.Telefono;

    const Tipo: IData = this.Get_IData('Tipo');
    Tipo.value = _usuario_.Tipo;

    const Sector: IData = this.Get_IData('Sector');
    Sector.value = _usuario_.Sector;

    return this._db_api_.Validar_Datos(
      [
        IDEvento,
        NomUsuario,
        Password,
        LimiteSesiones,
        FechaExpira,
        Nombre,
        Apellidos,
        Cargo,
        Correo,
        Telefono,
        Tipo,
        Sector,
      ],
      'usuarios'
    );
  }
  //#endregion
}
