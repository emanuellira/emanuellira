/** [# version: 6.3.5 #] */
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { forbiddenEmptyText } from 'src/app/directives/custom-validators/empty-text.validator';
import { AlertsService } from 'src/app/services/alerts.service';
import { DbapiService } from 'src/app/services/dbapi.service';
import { LangService } from 'src/app/services/lang.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-bvsuite-create',
  templateUrl: './bvsuite-create.component.html',
  styleUrls: ['./bvsuite-create.component.css'],
})
export class BvsuiteCreateComponent implements OnInit, OnDestroy {
  //#region [Propiedades]
  @Input() tipo: string = '';
  @Input() es_preliminar: boolean = false;
  app: number = 0;
  firma: any;
  firmas: Array<string> = [];
  subscription_reporte: any;
  language!: iModuleLang;
  //#endregion

  public formFirma: FormGroup = new FormGroup({});

  constructor(
    private _fb_: FormBuilder,
    private _db_api_: DbapiService,
    private _login_: LoginService,
    private _alert_: AlertsService,
    private _lang_: LangService
  ) {}

  ngOnInit(): void {
    this._lang_.modulo = 'bvsuitecreate';
    this.language = this._lang_.language_by_modulo;
    this.firmas = [];
    this.formFirma = this._fb_.group({
      txtFirmasNombre: ['', [forbiddenEmptyText('Debe teclear un Nombre.')]],
      txtFirmasCargo: ['', [forbiddenEmptyText('Debe teclear un Cargo.')]],
      cboFirmasList: [],
    });
  }

  get txtFirmasNombre() {
    return <FormControl>this.formFirma.get('txtFirmasNombre');
  }
  get txtFirmasCargo() {
    return <FormControl>this.formFirma.get('txtFirmasCargo');
  }
  get cboFirmasList() {
    return <FormControl>this.formFirma.get('cboFirmasList');
  }

  get Mostrar_Firmas() {
    return (
      this.tipo === 'WORD' &&
      (!this._login_.EsUsuarioSoloLectura || !this.es_preliminar)
    );
  }

  public CrearFirma() {
    if (this.formFirma.valid) {
      // console.log('crearFirma', this.formFirma.value);
      this.firma = `*${this.txtFirmasNombre.value}*.- ${this.txtFirmasCargo.value}`;
      this.firmas.push(this.firma);
      this.formFirma.reset();
    }
  }

  public BorrarFirma() {
    const index = this.firmas.indexOf(this.cboFirmasList.value);
    console.log(index, this.cboFirmasList);
    this.firmas.splice(index, 1);
  }

  public GenerarDocumento() {
    this._alert_.SetLoading = 'Generando documento...';
    let TIPO = this.tipo === 'WORD' ? 'DOC_WORD' : 'DOC_CSV';
    const DESC =
      this.tipo === 'WORD'
        ? `Archivo ${
            this.es_preliminar ? 'preliminar' : 'definitivo'
          } para el sector ${this._login_.Sector}`
        : '';

    const _tipo_ = `${TIPO}_${this.es_preliminar ? 'PRE' : 'DEF'}`;
    // console.log(_tipo_, this._login_.EsUsuarioSoloLectura);

    this.subscription_reporte = this._db_api_
      .Get_Reportes(
        _tipo_,
        DESC,
        this._login_.IDUsuario_Captura,
        this._login_.Sector_Captura,
        this._login_.IDEvento,
        this.firmas
      )
      .subscribe(
        (reporte) => {
          window.open(
            reporte.Url,
            '_blank',
            'resizable=yes,scrollbars=no,width="400",height="auto"'
          );
          this._alert_.Close();
        },
        (err) => {
          this._alert_.Close();
          console.error(err);
        }
      );
  }
  ngOnDestroy(): void {
    // this.subscription_reporte.unsubscribe();
    this.firmas = [];
  }
}
