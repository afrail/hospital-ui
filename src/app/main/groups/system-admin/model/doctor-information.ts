import {CommonModelField} from '../../../core/models/common-model-field';
import {AppUser} from './app-user';


export class DoctorInformation extends CommonModelField {

    bofEmployee: boolean;
    appUser: AppUser;
    staffType: number;
    name: string;
    banglaName: string;
    doctorRank: string;
    mobileNumber: string;
    specialFor: string;
    roomNo: string;
    activeDate: Date;
    inactiveDate: Date;
    picture: string;
    hosType: number;

    /*extra*/
    storageId: number;
    searchList: any;

}
