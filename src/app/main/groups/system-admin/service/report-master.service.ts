import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'environments/environment';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { Observable } from 'rxjs/internal/Observable';
import { CommonResponseList, CommonResponseObject } from 'app/main/core/models/common-response';
import { ReportMaster } from '../model/report-master';

@Injectable({
  providedIn: 'root'
})
export class ReportMasterService extends CrudRequestService<ReportMaster>{

  constructor(private http: HttpClient) {
    super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint +environment.ibcs.moduleSystemAdmin+ 'report-master');
  }


  getAuthorizedReportList(userId: number): Observable<CommonResponseList<ReportMaster>> {
    return this.http.get<CommonResponseList<ReportMaster>>( this._BASE_URL +'/authorized/' +userId);
  }


  uploadFile(i: any): Observable<CommonResponseObject<any>> {
    return this.http.post<CommonResponseObject<any>>( this._BASE_URL, i);
  }

}
