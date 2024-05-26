import {CommonModelField} from '../../../core/models/common-model-field';
import {AppUser} from './app-user';
import { ReportRole } from './report-role';

export class ReportRoleAssign extends CommonModelField {
    appUser: AppUser;
    reportRoleList: ReportRole[];
}
