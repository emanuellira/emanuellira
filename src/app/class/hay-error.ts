import { iModuleLang } from './interfaces/lang.interface';
import { IData } from './interfaces/plantilla.interface';

/** [# version: 6.2.5 #] */
export class HayError {
  private _hay_error_: boolean = false;
  private _mensaje_: string = '';
  private _language_!: iModuleLang;

  get Hay_Error() {
    return this._hay_error_;
  }

  get Mensaje(): string {
    return this._mensaje_;
  }

  set Mensaje(value: string) {
    this._hay_error_ = true;
    this._mensaje_ = value;
  }

  set language(value: iModuleLang) {
    this._language_ = value;
    // console.log(this._language_);
  }

  public constructor(_msg_: string = '') {
    this._mensaje_ = _msg_;
  }

  public Evalua_Text = (item: IData): HayError => {
    const value = item.value?.toString() || '';

    const funcs = [
      {
        eval: '>',
        f: () => value.length <= 0,
        m: `${item.alias} ${this._language_.no_vacio}`,
      },
      {
        eval: '=',
        f: () => value.length > 0,
        m: `${item.alias} ${this._language_.vacio}`,
      },
      { eval: '', f: () => true },
    ];

    const r = funcs.filter((f) => f.eval === item.required);
    const f = r.length ? r[0] : { f: () => false, m: '' };
    const he = new HayError();
    if (f.f()) {
      he.Mensaje = f.m || '';
    }
    return he;
  };

  Evalua_Number = (item: IData): HayError => {
    const value = item.value || '';

    const funcs = [
      {
        eval: '>',
        f: () => Number(value) <= 0,
        m: `${item.alias} ${this._language_.mayor_0}`,
      },
      {
        eval: '>=',
        f: () => Number(value) < 0,
        m: `${item.alias} ${this._language_.mayor_igual_0}`,
      },
      {
        eval: '<',
        f: () => Number(value) >= 0,
        m: `${item.alias} ${this._language_.menor_0}`,
      },
      {
        eval: '<=',
        f: () => Number(value) > 0,
        m: `${item.alias} ${this._language_.menor_igual_0}`,
      },

      {
        eval: '=',
        f: () => Number(value) !== 0,
        m: `${item.alias} ${this._language_.igual_0}`,
      },
      {
        eval: '<>',
        f: () => value.toString().length === 0,
        m: `${item.alias} ${this._language_.no_vacio}`,
      },
    ];

    const r = funcs.filter((f) => f.eval === item.required);
    // console.log(r[0].f());

    const f = r.length ? r[0] : { f: () => false, m: '' };
    const he = new HayError();
    if (f.f()) {
      he.Mensaje = f.m || '';
    }
    return he;
  };

  Evalua_Date = (item: IData): HayError => {
    const value_str = item.value?.toString() || '';
    const value = new Date(value_str).getTime();
    const now = new Date().getTime();

    const funcs = [
      {
        eval: '>',
        f: () => value <= now,
        m: `${item.alias} ${this._language_.mayor_fecha}`,
      },
      {
        eval: '>=',
        f: () => value < now,
        m: `${item.alias} ${this._language_.mayor_igual_fecha}`,
      },
      {
        eval: '<',
        f: () => value >= now,
        m: `${item.alias} ${this._language_.menor_fecha}`,
      },
      {
        eval: '<=',
        f: () => value > now,
        m: `${item.alias} ${this._language_.menor_igual_fecha}`,
      },

      { eval: '=', f: () => value !== now },
      { eval: '', f: () => true },
    ];

    const r = funcs.filter((f) => f.eval === item.required);
    const f = r.length ? r[0] : { f: () => false, m: '' };
    const he = new HayError();
    if (f.f()) {
      he.Mensaje = f.m || '';
    }
    return he;
  };
}
