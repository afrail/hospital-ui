import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {MenuItem} from '../model/menu-item';
import {Observable} from 'rxjs';
import {CommonResponseList} from '../../../core/models/common-response';
import {URL_GET_BY_MASTER_ID} from '../../../core/constants/api';

@Injectable({
  providedIn: 'root'
})
export class MenuItemService extends CrudRequestService<MenuItem>{

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleSystemAdmin + 'menu-item');
    }

    getByItemType(itemType: number): Observable<CommonResponseList<MenuItem>> {
        return this.http.get<CommonResponseList<MenuItem>>( this._BASE_URL + '/' + 'get-by-type' + '/' + itemType.toString());
    }

    getByItemTypeNot(itemType: number): Observable<CommonResponseList<MenuItem>> {
        return this.http.get<CommonResponseList<MenuItem>>( this._BASE_URL + '/' + 'get-by-type-not' + '/' + itemType.toString());
    }


}
