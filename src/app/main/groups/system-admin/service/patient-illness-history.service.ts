import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import { environment } from 'environments/environment';
import {CommonResponseList} from '../../../core/models/common-response';

@Injectable({
    providedIn: 'root'
})
export class PatientIllnessHistoryService extends CrudRequestService<any> {

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleEHM + 'patient-illness-history');
    }

    getByPatId(patId: number): Observable<CommonResponseList<any>> {
        return this.http.get<CommonResponseList<any>>(this._BASE_URL + '/' + 'get-by-pat-id' + '/' + patId.toString());
    }

}
