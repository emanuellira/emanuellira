/** [# version: 6.0.2 #] */

import { Injectable } from '@angular/core'
import { ValidatorFn } from '@angular/forms'
import { forbiddenEmptyText } from '../custom-validators/empty-text.validator';

@Injectable({
    providedIn: 'root'
})
export class LoginForm {
    static txtLoginNombre(txts:string[]): (string | ValidatorFn[])[] {
        
        return [
            '',
            [
                forbiddenEmptyText(txts[0])
            ]
        ]
    }

    static txtLoginPassword(txts:string[]): (string | ValidatorFn[])[]{
        return [
            '',
            [
                forbiddenEmptyText(txts[0])
            ]
        ]
    }
}
