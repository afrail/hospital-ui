import {CommonModelField} from '../../../core/models/common-model-field';
import {ApprovalTeam} from './approval-team';
import {AppUser} from './app-user';

export class ApprovalTeamDetails extends CommonModelField {
    appUser: AppUser;
    approvalTeamMaster: ApprovalTeam;
}
