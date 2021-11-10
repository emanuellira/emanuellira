/** [# version: 6.0.1 #] */
import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[appFormError]',
})
export class FormErrorDirective {
  // [# version: 1.0.4 #]

  //#region [Propiedades]: Name-> @Input()
  @Input() Errors: any;
  @Input() isFormGroup: FormGroup | undefined;
  //#endregion

  constructor(private _el: ElementRef) {
    // this.isFormGroup =
  }

  @HostListener('submit')
  onFormSubmit() {
    if (this.isFormGroup && this.isFormGroup.invalid) {
      for (const formCtrl of Object.values(this.isFormGroup.controls)) {
        formCtrl.markAsTouched();        
      }
    }
  }

  @HostListener('focusout', ['$event'])
  OnFocusOut(e:any) {
    // console.log(event?.target);
    if (e != null) this._ShowError(e.target as HTMLElement);
  }

  //#region [Function]: Name-> ShowError y Crear lista de errores
  private _ShowError(formCtrl: HTMLElement) {
    if (this.Errors === undefined || this.isFormGroup) return;
    // console.log(formCtrl);

    //Recuperar el tag a revisar
    let parentDiv = formCtrl.parentElement;
    const idError = `idError_${this._el.nativeElement.name}`;
    // console.log(formCtrl);
    //Comprobar y eliminar el tag de error
    let span: Element | null = document.getElementById(idError);
    if (span !== null && parentDiv) {
      parentDiv.removeChild(span);
    }

    //Preguntar si hay error
    if (
      formCtrl.className.indexOf('ng-invalid') >= 0 &&
      formCtrl.className.indexOf('ng-touched') >= 0
    ) {
      // console.log('ok');
      span = document.createElement('span');
      span.id = idError;
      span.className = 'text-error';
      span.innerHTML = this._CrearListaMensajesErrores();

      // console.log(parentDiv);
      if (parentDiv) parentDiv.append(span);
    }
  }

  private _CrearListaMensajesErrores(): string {
    // console.log(this.Errors);

    return Object.values(this.Errors)
      .map((error: any) => error.value)
      .join('</div><div>');
    // return '';
  }
  //#endregion
}
