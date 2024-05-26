import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {ApprovalHistory} from '../model/approval-history';
import {Observable} from 'rxjs';
import {CommonResponseList, CommonResponseObject} from '../../../core/models/common-response';

@Injectable({
  providedIn: 'root'
})
export class ApprovalHistoryService extends CrudRequestService<ApprovalHistory>{

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleSystemAdmin + 'approval-history');
    }

    getByTransactionId(transactionId: number, transactionTable: string): Observable<CommonResponseList<ApprovalHistory>> {
        return this.http.get<CommonResponseList<ApprovalHistory>>(this._BASE_URL + '/' + 'get-by-transaction-id' + '/' + transactionId + '/' + transactionTable);
    }

    getByDefaultUserId(defaultUserId: number, ): Observable<CommonResponseList<ApprovalHistory>> {
        return this.http.get<CommonResponseList<ApprovalHistory>>(this._BASE_URL + '/' + 'get-by-default-user-id' + '/' + defaultUserId);
    }

    getByTransactionIdAndToApprovalTeamId(transactionId: number, transactionTable: string, toApprovalTeamId: number): Observable<CommonResponseList<ApprovalHistory>> {
        return this.http.get<CommonResponseList<ApprovalHistory>>(this._BASE_URL +
            '/' + 'get-by-transaction-and-to-approval' + '/' + transactionId + '/' + transactionTable + '/' + toApprovalTeamId
        );
    }

    getSubmitUserInfo(transactionId: number, transactionTable: string): Observable<CommonResponseObject<ApprovalHistory>> {
        return this.http.get<CommonResponseObject<ApprovalHistory>>(this._BASE_URL + '/' + 'get-submit-user-info' + '/' + transactionId + '/' + transactionTable);
    }

    getUserInfo(transactionId: number, transactionTable: string, status: string, active: boolean ): Observable<CommonResponseObject<ApprovalHistory>> {
        return this.http.get<CommonResponseObject<ApprovalHistory>>(this._BASE_URL + '/' + 'get-user-info' + '/' + transactionId + '/' + transactionTable
                + '/' + status + '/' + active);
    }

}
