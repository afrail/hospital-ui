import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {MenuItem} from '../model/menu-item';
import {MenuItemUrl} from '../model/menu-item-url';

@Injectable({
  providedIn: 'root'
})
export class MenuItemUrlService extends CrudRequestService<MenuItemUrl>{

  constructor(http: HttpClient) {
    super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleSystemAdmin + 'menu-item-url');
  }

}
