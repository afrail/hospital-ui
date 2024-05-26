import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { environment } from 'environments/environment';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { Observable } from 'rxjs/internal/Observable';
import { CommonResponseList, CommonResponseObject } from 'app/main/core/models/common-response';
import { ReportUpload } from '../model/report-upload';

@Injectable({
  providedIn: 'root'
})
export class ReportUploadService extends CrudRequestService<ReportUpload>{

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleSystemAdmin + 'report-upload');
    }


    uploadFile(i: any): Observable<CommonResponseObject<any>> {
        return this.http.post<CommonResponseObject<any>>( this._BASE_URL, i);
    }

    getAllActiveSubreportList(): Observable<CommonResponseList<ReportUpload>> {
        return this.http.get<CommonResponseList<ReportUpload>>( this._BASE_URL + '/subreport');
    }

    getAllActiveMasterReportList(): Observable<CommonResponseList<ReportUpload>> {
        return this.http.get<CommonResponseList<ReportUpload>>( this._BASE_URL + '/master-report');
    }

    downloadFile(filename: string): any {
        return this.http.get(this._BASE_URL + '/download/' + filename, {responseType: 'blob'});
    }

}
