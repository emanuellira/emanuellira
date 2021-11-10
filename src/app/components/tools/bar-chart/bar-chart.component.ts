//[# version: 6.4.1 #]
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { IMenu } from 'src/app/class/interfaces/menu.interface';
import { IResultado } from 'src/app/class/interfaces/resultado.interface';
import { DbapiService } from 'src/app/services/dbapi.service';
import { LangService } from 'src/app/services/lang.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.css'],
})
export class BarChartComponent implements OnInit {
  //#region [Propiedades]:
  @Input() indicador: IMenu = { label: '', icon: '', btn: '' };
  @Input() index_indicador: number = -1;
  @Input() data_aux: Array<IResultado> = [];
  @Output() On_Filter: EventEmitter<any> = new EventEmitter();
  @Output() On_Delete: EventEmitter<any> = new EventEmitter();
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartLabels: Array<Label> = [];
  public barChartData: Array<ChartDataSets> = [];
  public barChartColors = [{ backgroundColor: [''] }];
  data: Array<IResultado> = [];
  language!: iModuleLang;
  //#endregion

  //#region [OnInit]:
  constructor(private _db_api_: DbapiService, private _login_: LoginService,  private _lang_: LangService) {}

  ngOnInit(): void {
    this._lang_.modulo = 'barchat';
    this.language = this._lang_.language_by_modulo;
    this.Get_Data();
  }
  //#endregion

  //#region [Getters]: Name->
  get color_base() {
    return this.language.color_base;
  }

  get color_blue() {
    return this.language.color_blue;
  }
  get color_green() {
    return this.language.color_green;
  }
  //#endregion

  //#region [Function]: Name-> Events
  ChartClicked = async (_e_: any) => {
    if (_e_.active[0]._view.label) {
      const idx = _e_.active[0]._index;
      const item = this.data[idx]; // this.data.find((f) => f.Tipo === _e_.active[0]._view.label);
      if (this.indicador.icon) {
        const count_bars = this.data.length;
        this.barChartColors[0].backgroundColor = [];
        for (let index = 0; index < count_bars; index++) {
          if (index === idx)
            this.barChartColors[0].backgroundColor.push(this.color_green);
          else this.barChartColors[0].backgroundColor.push(this.color_base);
        }
        // console.log(item);
        const data_filtered = await this.Filter_Aply(item);
        // console.log(data_filtered);
        this.On_Filter.emit([data_filtered, this.index_indicador, item.Tipo]);
      }
    }
  };

  Filter_Aply = (_item_: IResultado) =>
    new Promise((resolve, reject) => {
      this._db_api_
        .Get_Indicador(
          this._login_.IDUsuario_Captura,
          this.indicador.icon,
          _item_.ID
        )
        .subscribe(
          (filter) => resolve(filter),
          (err) => reject(err)
        );
    });

  // public chartHovered({
  //   event,
  //   active,
  // }: {
  //   event: MouseEvent;
  //   active: {}[];
  // }): void {
  //   console.log(active);
  // }

  public Get_Data(): void {
    this.barChartData = [];
    this.barChartData.push({ data: [], label: this.indicador.label });

    if (this.data_aux.length > 0) {
      this.data = this.data_aux;
      this.Set_Chart(this.data, this.color_green);
      return;
    }

    this._db_api_
      .Get_Indicador(this._login_.IDUsuario_Captura, this.indicador.btn, -1)
      .subscribe(
        (data) => {
          this.data = data;
          // console.log(data);
          this.Set_Chart(data, this.color_blue);
        },
        (err) => {
          console.log(err);
        }
      );
  }

  Delete_Filter = () => {
    const count_bars = this.data.length;
    this.barChartColors[0].backgroundColor = [];
    for (let index = 0; index < count_bars; index++) {
      this.barChartColors[0].backgroundColor.push(this.color_blue);
    }

    this.On_Delete.emit([this.index_indicador]);
  };

  private Set_Chart(_data_: IResultado[], _color_: string) {
    this.barChartLabels = _data_.map((i) => i.Tipo);
    const values = _data_.map((i) => Number(i.Descripcion));
    this.barChartData[0].data = values;
    const count_bars = values.length;
    this.barChartColors[0].backgroundColor = [];
    for (let index = 0; index < count_bars; index++) {
      this.barChartColors[0].backgroundColor.push(_color_);
    }
  }
  //#endregion
}
