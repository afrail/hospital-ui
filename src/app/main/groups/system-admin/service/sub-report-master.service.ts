import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'environments/environment';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { Observable } from 'rxjs/internal/Observable';
import { CommonResponseObject } from 'app/main/core/models/common-response';
import { ReportMaster } from '../model/report-master';
import { SubReportMaster } from '../model/sub-report-master';

@Injectable({
  providedIn: 'root'
})
export class SubReportMasterService extends CrudRequestService<SubReportMaster>{

  constructor(private http: HttpClient) {
    super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint +environment.ibcs.moduleSystemAdmin+ 'sub-report-master');
  }


  uploadFile(i: any): Observable<CommonResponseObject<any>> {
    return this.http.post<CommonResponseObject<any>>( this._BASE_URL, i);
  }

}
