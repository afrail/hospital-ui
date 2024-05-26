import {CommonModelField} from '../../../core/models/common-model-field';
import {ApprovalTeam} from './approval-team';
import {AppUser} from './app-user';
import {MenuItem} from './menu-item';
import {ApprovalStatus} from '../mock-api/approval-status.service';
import {AppUserEmployee} from './app-user-employee';

export class ApprovalHistory extends CommonModelField {
    transactionId: number;
    transactionTable: string;
    transactionType: string;
    fromApprovalTeam: ApprovalTeam;
    fromUserId: AppUser;
    fromEmpCode: string;
    toApprovalTeam: ApprovalTeam;
    defaultUser: AppUser;
    approvalStatus: string;
    amount: number;
    comment: string;
    action: boolean;
    read: boolean;
    readDate: Date;
    close: boolean;
    link: string;

    /*will remove*/
    module: MenuItem;

    // extra
    status: ApprovalStatus;
    fromAppUserEmployee: AppUserEmployee;


}



