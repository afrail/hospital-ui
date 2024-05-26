import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {AppUserEmployee} from '../model/app-user-employee';
import {Observable} from 'rxjs';
import {CommonResponseList, CommonResponseObject} from '../../../core/models/common-response';
import {ApprovalHistory} from '../model/approval-history';

@Injectable({
  providedIn: 'root'
})
export class AppUserEmployeeService extends CrudRequestService<AppUserEmployee>{

  constructor(private http: HttpClient) {
    super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleSystemAdmin + 'app-user-employee');
  }

    getByAppUserId(appUserId: number, ): Observable<CommonResponseObject<AppUserEmployee>> {
        return this.http.get<CommonResponseObject<AppUserEmployee>>(this._BASE_URL + '/' + 'get-by-app-user-id' + '/' + appUserId);
    }

    getByTransactionTableAndId(transactionId: number, transactionTable: string): Observable<CommonResponseList<AppUserEmployee>> {
        return this.http.get<CommonResponseList<AppUserEmployee>>(this._BASE_URL + '/' + 'get-by-transaction-table-and-id' + '/' + transactionId + '/' + transactionTable);
    }

}
