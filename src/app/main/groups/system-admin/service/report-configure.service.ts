import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { environment } from 'environments/environment';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { ReportConfigure } from '../model/report-configure';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReportConfigureService extends CrudRequestService<ReportConfigure>{

    constructor(private http: HttpClient) {
         super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint +environment.ibcs.moduleSystemAdmin+ 'report-configure');
    }


    downloadReport(params: any | undefined): Observable<Blob> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

        return this.http.post(
            this._BASE_URL+'/generate-report/download',
            params,
            { headers, responseType: 'blob'}
          );
    }


    printReport(params: any | undefined): Observable<Blob> {
        const headers = new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8');

        return this.http.post(
            this._BASE_URL+'/generate-report/print',
            params,
            { headers, responseType: 'blob'}
          );
    }
}
