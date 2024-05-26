import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {UserOfficeAssign} from '../model/user-office-assign';
import {Observable} from 'rxjs';
import {CommonResponseList, CommonResponseObject} from '../../../core/models/common-response';
import {URL_GET_BY_MASTER_ID} from '../../../core/constants/api';


@Injectable({
  providedIn: 'root'
})
export class UserOfficeAssignService extends CrudRequestService<UserOfficeAssign>{

  constructor(private http: HttpClient) {
    super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleSystemAdmin + 'user-office-assign');
  }

  getByAppUserId(appUser: number): Observable<CommonResponseObject<UserOfficeAssign>> {
    return this.http.get<CommonResponseObject<UserOfficeAssign>>( this._BASE_URL + '/' + 'get-by-appuser' + '/' + appUser);
  }

}
