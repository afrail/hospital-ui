import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { ReportWithParameter } from '../model/report-with-parameter';

@Injectable({
  providedIn: 'root'
})
export class ReportWithParameterService extends CrudRequestService<ReportWithParameter>{

  constructor(http: HttpClient) {
    super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint +environment.ibcs.moduleSystemAdmin+ 'report-with-parameter');
  }
}
