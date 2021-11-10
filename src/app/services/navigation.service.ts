/** [# version: 6.0.1 #] */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IPaths } from '../class/interfaces/path.interface';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private _current_view_: IPaths | undefined = undefined;
  private _views_: Array<IPaths> = [];

  constructor(private _router_: Router) {}

  /**
   * @name Next_View
   * @param value: { path, param }
   * @description Recibe el path, si es el current_view es indefinido entonces
   * solo realiza la navegación, de lo contrario, asigna a _views_ el current_view
   * y lo actualiza con el nuevo path.
   */
  set Next_View(value: IPaths) {
    if (this.Current_View) this._views_.push(this.Current_View);

    this.Current_View = value;
    this.Navigate();
  }

  /**
   * @name Back_View
   * @description Si _views_ ya contiene un elemento, lo regresa al current_view
   * y realiza la navegación.
   */
  Back_View = () => {
    this.Current_View = this._views_.pop();
    this.Navigate();
  };

  /**
   * @description Realizan la asignación al current_view
   */
  set Current_View(value: IPaths | undefined) {
    this._current_view_ = value;
  }

  get Current_View(): IPaths | undefined {
    return this._current_view_;
  }

  /**
   * @name Navigate
   * @description Navega hacia la vista que tenga el current_view
   */
  private Navigate = () => {
    if (this._current_view_?.param)
    this._router_.navigate([
      this._current_view_?.path,
      this._current_view_?.param,
    ]);
    else this._router_.navigate([this._current_view_?.path]);
  };
}
