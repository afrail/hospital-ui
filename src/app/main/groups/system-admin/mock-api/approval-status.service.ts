import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ApprovalStatusService {

    /*property*/
    public OFFICE_BOF_SECURITY: number = 910;
    public OFFICE_BUDGET_AND_CASH: number = 1014;

    /*common*/
    public APPROVAL_ROUTER_PREFIX = '/common-group/181/';
    public APPROVAL_ROUTER_SUFFIX = '-approve';

    /*leave information*/
    public TABLE_LEAVE_APPLICATION = 'HRM_EMPLOYEE_LEAVE_INFORMATION';
    public TYPE_LEAVE_APPLICATION = 'Leave Application';

    /*leave information*/
    public TABLE_ID_REQUEST = 'ACC_EMPLOYEE_ID_REQUEST_MASTER';
    public TYPE_ID_REQUEST = 'Id Card Request';

    /*leave information*/
    public TABLE_ICT_ITEM_INDENT = 'ICT_ITEM_INDENT_MASTER';
    public TYPE_ICT_ITEM_INDENT = 'ICT Indent Request';

    /*common note*/
    public TABLE_COMMON_NOTE = 'COMMON_NOTE_SHEET';
    public TYPE_COMMON_NOTE = 'Common Note';

    /*common note*/
    public TABLE_GATE_PASS = 'CLR_GATE_PASS_APPLICATION_MASTER';
    public TYPE_GATE_PASS = 'Gate Pass Application';

    /*drawing access request*/
    public TABLE_DRW_FILE_ACCESS_REQUEST = 'DRW_FILE_ACCESS_REQUEST_MASTER';
    public TYPE_DRW_FILE_ACCESS_REQUEST = 'Drawing File Access Request';

    /*budget demand*/
    public TABLE_BUDGET_DEMAND = 'BUDGET_DEMAND_MASTER';
    public TYPE_BUDGET_DEMAND = 'Budget Demand';

    /*leave information*/
    public TABLE_RAW_RATION_INDENT_MASTER = 'RAW_RATION_INDENT_MASTER';
    public TYPE_RATION_ITEM_INDENT = 'Ration Indent Request';

    public PENDING_ID = 'P';
    public SUBMIT_ID = 'S';
    public FORWARD_ID = 'F';
    public BACK_ID = 'B';
    public APPROVED_ID = 'A';
    public NOTIFY_ID = 'N';




    getList(): ApprovalStatus[]{
        const list = [];
        list.push(new ApprovalStatus(this.PENDING_ID, 'Pending', 'gray'));
        list.push(new ApprovalStatus(this.SUBMIT_ID, 'Submit', 'blue'));
        list.push(new ApprovalStatus(this.FORWARD_ID, 'Forward', 'orange'));
        list.push(new ApprovalStatus(this.BACK_ID, 'Back', 'red'));
        list.push(new ApprovalStatus(this.APPROVED_ID, 'Approved', 'green'));
        return list;
    }
}

export class ApprovalStatus {
    id: string;
    name: string;
    color: string;
    constructor(id, name, color ){
        this.id = id;
        this.name = name;
        this.color = color;
    }
}


