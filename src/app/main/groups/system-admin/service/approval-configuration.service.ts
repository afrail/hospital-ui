import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {Observable} from 'rxjs';
import {CommonResponseList} from '../../../core/models/common-response';
import {ApprovalConfiguration} from '../model/approval-configuration';

@Injectable({
  providedIn: 'root'
})
export class ApprovalConfigurationService extends CrudRequestService<ApprovalConfiguration>{

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleSystemAdmin + 'approval-configuration');
    }

    getByOfficeId(officeId: string): Observable<CommonResponseList<ApprovalConfiguration>> {
        return this.http.get<CommonResponseList<ApprovalConfiguration>>( this._BASE_URL + '/' + 'get-by-office-id' + '/' + officeId);
    }

}
