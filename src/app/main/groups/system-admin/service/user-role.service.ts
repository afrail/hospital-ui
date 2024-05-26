import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {MenuItem} from '../model/menu-item';
import {MenuItemUrl} from '../model/menu-item-url';
import {UserRole} from '../model/user-role';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService extends CrudRequestService<UserRole>{

  constructor(http: HttpClient) {
    super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleSystemAdmin + 'user-role');
  }

}
