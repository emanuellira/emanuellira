import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-bvsuite-filter-matricula',
  templateUrl: './bvsuite-filter-matricula.component.html',
  styleUrls: ['./bvsuite-filter-matricula.component.css']
})
export class BvsuiteFilterMatriculaComponent implements OnInit {
  @Input() tipo: string = '';
  @Input() es_reporte_filtro: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
