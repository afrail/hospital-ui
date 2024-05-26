import {CommonModelField} from '../../../core/models/common-model-field';

export class PasswordPolicy extends CommonModelField {
    name: string;
    minLength: number;
    sequential: boolean;
    specialChar: boolean;
    alphanumeric: boolean;
    upperLower: boolean;
    matchUsername: boolean;
    passwordRemember: number;
    passwordAge: number;

}
