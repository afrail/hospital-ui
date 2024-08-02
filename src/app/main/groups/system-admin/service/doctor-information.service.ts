import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';
import {DoctorInformation} from '../model/doctor-information';
import {Observable} from 'rxjs';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {CommonResponseList, CommonResponseObject} from '../../../core/models/common-response';


@Injectable({
    providedIn: 'root'
})
export class DoctorInformationService extends CrudRequestService<DoctorInformation> {

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleEHM + 'doctor-information');
    }


    getByAppUserId(appUser: number): Observable<CommonResponseObject<DoctorInformation>> {
        return this.http.get<CommonResponseObject<DoctorInformation>>(this._BASE_URL + '/' + 'get-by-app-user' + '/' + appUser);
    }

}
