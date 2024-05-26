import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {AppUser} from '../model/app-user';
import {Observable} from 'rxjs';
import {CommonResponseList, CommonResponseObject} from '../../../core/models/common-response';
import {AppUserEmployee} from '../model/app-user-employee';
import {PasswordChangeDto} from '../../auth/settings/security/password-change-dto';

@Injectable({
  providedIn: 'root'
})
export class AppUserService extends CrudRequestService<AppUser>{

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleSystemAdmin + 'app-user');
    }

    getProfile(): Observable<CommonResponseObject<AppUser>> {
        return this.http.get<CommonResponseObject<AppUser>>(this._BASE_URL + '/' + 'profile');
    }

    changePassword(dto: PasswordChangeDto): Observable<CommonResponseObject<any>> {
        return this.http.post<CommonResponseObject<any>>(this._BASE_URL + '/' + 'change-password', dto);
    }

}
