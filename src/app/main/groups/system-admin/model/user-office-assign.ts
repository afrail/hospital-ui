import {CommonModelField} from '../../../core/models/common-model-field';
import { CommonLookupDetails } from '../../administration/modules/hrm-stuff/model/common-lookup-details';
import {AppUser} from './app-user';


export class UserOfficeAssign extends CommonModelField {
    appUser: AppUser;
    userOfficeList: CommonLookupDetails[];

}
