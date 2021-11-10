/** [# version: 6.0.2 #] */
import { ValidatorFn, AbstractControl } from '@angular/forms';

/** No se permiten textos vacíos */
export function forbiddenEmptyText(msgError: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
        let value: string = control.value || "";
        value = value.trim();
        
        return value.length === 0 ?
            {
                'forbiddenEmptyText': {
                    value: msgError
                }
            } :
            null;
    };
}