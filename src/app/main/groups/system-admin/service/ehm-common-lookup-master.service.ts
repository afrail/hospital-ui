import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {CommonLookupMaster} from '../model/common-lookup-master';


@Injectable({
    providedIn: 'root'
})
export class EhmCommonLookupMasterService extends CrudRequestService<CommonLookupMaster> {

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleEHM + 'common-lookup-master');
    }

}
