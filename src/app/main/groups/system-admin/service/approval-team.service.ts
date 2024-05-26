import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {ApprovalTeam} from '../model/approval-team';
import {Observable} from 'rxjs';
import {CommonResponseList, CommonResponseObject} from '../../../core/models/common-response';
import {ApprovalHistory} from '../model/approval-history';

@Injectable({
  providedIn: 'root'
})
export class ApprovalTeamService extends CrudRequestService<ApprovalTeam>{

  constructor(private http: HttpClient) {
    super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleSystemAdmin + 'approval-team');
  }

    getByModuleId(moduleId: number): Observable<CommonResponseList<ApprovalTeam>> {
        return this.http.get<CommonResponseList<ApprovalTeam>>(this._BASE_URL + '/' + 'get-by-module-id' + '/' + moduleId );
    }

}
