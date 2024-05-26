import {CommonModelField} from '../../../core/models/common-model-field';
import {ApprovalTeam} from './approval-team';
import {AppUser} from './app-user';
import {MenuItem} from './menu-item';

export class ApprovalConfiguration extends CommonModelField {
    serialNo: number;
    fromApprovalTeam: ApprovalTeam;
    toApprovalTeam: ApprovalTeam;
    defaultUser: AppUser;
    minAmount: number;
    maxAmount: number;

    /* will remove */
    module: MenuItem;
}


