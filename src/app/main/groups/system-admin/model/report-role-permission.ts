import { ReportMaster } from './report-master';
import {CommonModelField} from '../../../core/models/common-model-field';
import { ReportRole } from './report-role';

export class ReportRolePermission extends CommonModelField {
    reportRole: ReportRole;
    report: ReportMaster;
}
