import { Component, OnInit } from '@angular/core';
import { iModuleLang } from 'src/app/class/interfaces/lang.interface';
import { ICONS_, TYPE_ALERT_, _ICONS_, _TYPE_ALERT_ } from 'src/app/global/globals';
import { LangService } from 'src/app/services/lang.service';
declare var bootstrap: any;

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css'],
})
export class AlertsComponent implements OnInit {
  mensaje: string = 'Hello';
  private normal_toast: any;
  private toastElement: HTMLElement | null;
  timer = 3000;
  language!: iModuleLang;

  constructor(   private _lang_: LangService) {
    this.toastElement = document.querySelector('[normal_toast]');
    if (this.toastElement) {
      this.normal_toast = new bootstrap.Toast(this.toastElement, {
        delay: 3000,
        autohide: true,
        animation: true,
      });
      // console.log('onInit');
    }
  }

  ngOnInit(): void {
    // this._lang_.modulo = 'alerts';
    // this.language = this._lang_.language_by_modulo;
  }

  Show = (
    type: TYPE_ALERT_ = 'info',
    msg: string = '!',
    icon: ICONS_ = 'info-circle',
    timer = 3000
  ) => {
    let body: HTMLElement | null = document.querySelector(
      '[normal_toast_body]'
    );
    if (body) body.innerHTML = msg;

    this.timer = timer;
    let icon_toast = document.querySelector('[icon_toast]');

    // this.toastElement?.classList.remove(`border`);
    for (const k of _TYPE_ALERT_) {
      // this.toastElement?.classList.remove(`border-${k}`);
      icon_toast?.classList.remove(`bg-${k}`);
    }

    // this.toastElement?.classList.remove('text-white');
    for (const k of _ICONS_) {
      icon_toast?.classList.remove(`icon-${k}`);
    }
    icon_toast?.classList.add(`icon-${icon}`);

    // this.toastElement?.classList.add(`border`);
    // this.toastElement?.classList.add(`border-${type}`);
    this.toastElement?.classList.add(`bg-${type}`);
    // if (type !== 'light') this.toastElement?.classList.add('text-white');

    this.normal_toast.display = timer;
    this.normal_toast.show();
  };

  Close = () => {
    this.normal_toast.hide();
  };
}
