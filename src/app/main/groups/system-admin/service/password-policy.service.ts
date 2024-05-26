import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {PasswordPolicy} from '../model/password-policy';

@Injectable({
  providedIn: 'root'
})
export class PasswordPolicyService extends CrudRequestService<PasswordPolicy>{

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleSystemAdmin + 'password-policy');
    }

}