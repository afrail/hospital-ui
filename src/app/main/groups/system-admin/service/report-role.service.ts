import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import { ReportRoleRequest } from '../features/report-role/request/report-role-request';

@Injectable({
  providedIn: 'root'
})
export class ReportRoleService extends CrudRequestService<ReportRoleRequest>{

  constructor(http: HttpClient) {
    super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleSystemAdmin + 'report-role');
  }

}
