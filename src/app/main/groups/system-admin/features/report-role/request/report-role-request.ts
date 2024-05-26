import { ReportRole } from "../../../model/report-role";
import { ReportRolePermission } from "../../../model/report-role-permission";

export class ReportRoleRequest {
    reportRole: ReportRole;
    reportPermission: ReportRolePermission[];
}
