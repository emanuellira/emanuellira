/** [# version: 6.0.2 #] */
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PATH_ } from '../global/globals';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(private _router_: Router, private _login_: LoginService) {}

  canActivate() {
    if (this._login_.EstaLogeado) return true;
    else {
      /**
       * Es para no alterar el NavigationService en su funcionalidad
       * por lo tanto no debe cambiar.
       */
      this._router_.navigate([PATH_._LOGIN_]);
      return false;
    }
  }
}
