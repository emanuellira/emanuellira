/** [# version: 7.5.2 #] */
import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginService } from './login.service';
@Injectable({
  providedIn: 'root',
})
export class LoginInterceptorService implements HttpInterceptor {
  constructor(private _login_: LoginService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token: string = this._login_.Token;

    let request = req;

    if (token) {
      request = req.clone({
        setHeaders: {
          authorization: `Bearer ${token}`,
          sired_api_key: this._login_.config.sired_api_key!,
        },
      });
    } else {
      request = req.clone({
        setHeaders: { sired_api_key: this._login_.config.sired_api_key! },
      });
    }
    // console.log(request);
    return next.handle(request);
  }
}
