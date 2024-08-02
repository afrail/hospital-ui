import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {CommonLookupDetails} from '../model/common-lookup-details';


@Injectable({
    providedIn: 'root'
})
export class EhmCommonLookupDetailsService extends CrudRequestService<CommonLookupDetails> {

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleEHM + 'common-lookup-details');
    }


}
