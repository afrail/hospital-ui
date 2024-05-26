import {CommonModelField} from '../../../core/models/common-model-field';
import {ApprovalTeamDetails} from './approval-team-details';
import {MenuItem} from './menu-item';

export class ApprovalTeam extends CommonModelField {
    serialNo: number;
    // module: MenuItem;
    name: string;
    banglaName: string;
    approvalTeamDetailList: ApprovalTeamDetails[];

}
