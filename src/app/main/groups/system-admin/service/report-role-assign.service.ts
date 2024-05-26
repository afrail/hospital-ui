import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import { ReportRoleAssign } from '../model/report-role-assign';

@Injectable({
  providedIn: 'root'
})
export class ReportRoleAssignService extends CrudRequestService<ReportRoleAssign>{

  constructor(http: HttpClient) {
    super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleSystemAdmin + 'report-role-assign');
  }

}
