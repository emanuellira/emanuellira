import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bvsuite-filter-ambiente',
  templateUrl: './bvsuite-filter-ambiente.component.html',
  styleUrls: ['./bvsuite-filter-ambiente.component.css']
})
export class BvsuiteFilterAmbienteComponent implements OnInit {
  @Input() tipo: string = '';
  @Input() es_reporte_filtro: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
