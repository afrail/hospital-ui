import {CommonModelField} from '../../../core/models/common-model-field';
import {PasswordPolicy} from './password-policy';


export class AppUser extends CommonModelField {
    username: string;
    password: string;
    email: string;
    mobile: string;
    employeeCode: string;
    name: string;
    banglaName: string;
    designation: string;
    accountExpired: boolean;
    credentialsExpired: boolean;
    accountLocked: boolean;
    passwordPolicy: PasswordPolicy;
}
