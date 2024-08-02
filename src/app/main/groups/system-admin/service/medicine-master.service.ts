import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';
import {MedicineMaster} from '../model/medicine-master';
import {Observable} from 'rxjs';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {CommonResponseList, CommonResponsePageable} from '../../../core/models/common-response';
import {URL_GET_PAGEABLE} from '../../../core/constants/api';

@Injectable({
    providedIn: 'root'
})
export class MedicineMasterService extends CrudRequestService<MedicineMaster> {

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleEHM + 'medicine-master');
    }
}
