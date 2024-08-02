import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TokenRegister} from '../model/token-register';
import {environment} from '../../../../../environments/environment';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {CommonResponseList, CommonResponseObject} from '../../../core/models/common-response';
import {DoctorInformation} from '../model/doctor-information';


@Injectable({
    providedIn: 'root'
})
export class TokenRegisterService extends CrudRequestService<TokenRegister> {

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleEHM + 'token-register');
    }

    getPatientPhoneNumber(phone: any): Observable<CommonResponseObject<TokenRegister>> {
        return this.http.put<CommonResponseObject<TokenRegister>>(this._BASE_URL + '/' + 'get-patient', phone);
    }

    updateMaster(obj: TokenRegister): Observable<CommonResponseList<TokenRegister>> {
        return this.http.put<CommonResponseList<TokenRegister>>(this._BASE_URL + '/' + 'update-master', obj);
    }

    getByAppUserId(appUserId: number): Observable<CommonResponseList<TokenRegister>> {
        return this.http.get<CommonResponseList<TokenRegister>>(this._BASE_URL + '/' + 'get-by-app-user-id' + '/' + appUserId);
    }




}
