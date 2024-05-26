import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {CommonMessageHistory} from '../model/common-message-history';
import {Observable} from 'rxjs';
import {CommonResponseList} from '../../../core/models/common-response';

@Injectable({
    providedIn: 'root'
})
export class CommonMessageHistoryService extends CrudRequestService<CommonMessageHistory> {

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleCommon + 'common-message-history');
    }

    getByUsername(userName: string): Observable<CommonResponseList<CommonMessageHistory>> {
        return this.http.get<CommonResponseList<CommonMessageHistory>>( this._BASE_URL + `/username/${userName}`);
    }

}
