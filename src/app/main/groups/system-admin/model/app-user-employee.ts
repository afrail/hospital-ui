import {CommonModelField} from '../../../core/models/common-model-field';
import {AppUser} from './app-user';

export class AppUserEmployee extends CommonModelField {
    appUser: AppUser;
    employeeCode: string;
    displayName: string;
    name: string;
    banglaName: string;
    designation: string;
    mobile: string;
    email: string;
    activeDate: Date;
    inactiveDate: Date;

    // other
    generatePassword: boolean;
    password: string;
}
