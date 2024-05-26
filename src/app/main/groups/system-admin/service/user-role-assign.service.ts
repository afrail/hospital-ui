import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'environments/environment';
import {CrudRequestService} from '../../../core/services/crud-request.service';
import {UserRoleAssignDto} from '../features/user-role-assign/user-role-add/request/user-role-assign-dto';

@Injectable({
    providedIn: 'root'
})
export class UserRoleAssignService extends CrudRequestService<UserRoleAssignDto> {

    constructor(http: HttpClient) {
        super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleSystemAdmin + 'user-role-assign');
    }

}
