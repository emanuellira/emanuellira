/** [# version: 6.0.3 #] */
import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { AlertsComponent } from '../components/tools/alerts/alerts.component';
import { ICONS_, TYPE_ALERT_ } from '../global/globals';
@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  //#region [Getters]: Name-> SetLoading
  // private _SetLoading: string;
  public set SetLoading(value: string) {
    Swal.fire({
      title: value,
      backdrop: true,
      allowOutsideClick: false,
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      },
      willClose: () => {
        Swal.hideLoading();
      },
    });
    // this._SetLoading = value;
  }

  public Close = () => Swal.close();
  // public get SetLoading(): string { return this._SetLoading; }
  //#endregion

  constructor(private _alert_: AlertsComponent) {}

  //#region [Function]: Name-> FireToast permite enviar un toast con un tiempo de 3s
  public FireToast(
    message: string,
    type: SweetAlertIcon = 'success',
    timer = 5000
  ) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: timer,
      // timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    let tc = '';
    switch (type) {
      case 'error':
        tc = 'text-danger';
        break;

      default:
        break;
    }

    return new Promise((resolve) => {
      Toast.fire({ icon: type, title: `<p class="${tc}">${message}</p>` }).then(
        (result) => {
          resolve(result);
        }
      );
    });
  }
  //#endregion

  //#region [Function]: Name-> FireToastOwn
  FireToastOwn(
    message: string,
    type: TYPE_ALERT_ = 'info',
    icon: ICONS_ = 'info-circle',
    timer: number = 5000
  ) {
    this._alert_.Show(type, message, icon, timer);
  }
  //#endregion

  //#region [Function]: Name-> ShowWait un mensaje informativo
  public ShowWait(
    message: string,
    footer?: string,
    type: SweetAlertIcon = 'success'
  ) {
    Swal.fire({
      position: 'center',
      icon: type,
      title: message,
      footer: footer,
      backdrop: true,
      allowOutsideClick: false,
      showConfirmButton: true,
    });
  }
  //#endregion

  public Confirm(
    _message_: string,
    _texto_: string = '',
    _is_only_ok_no_: boolean = true,
    _ok_text_: string = 'Si',
    _no_text_: string = 'No'
  ): Promise<string> {
    return new Promise((resolve) => {
      Swal.fire({
        title: _message_,
        html: _texto_,
        showDenyButton: true,
        showCancelButton: !_is_only_ok_no_,
        confirmButtonText: _ok_text_,
        denyButtonText: _no_text_,
      }).then((result) => {
        if (result.isConfirmed) {
          resolve('ok');
        } else if (result.isDenied) {
          resolve('no');
        }
      });
    });
  }
}
