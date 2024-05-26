import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { ParameterMaster } from '../model/parameter-master';

@Injectable({
  providedIn: 'root'
})
export class ParameterMasterService extends CrudRequestService<ParameterMaster>{

  constructor(http: HttpClient) {
    super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint +environment.ibcs.moduleSystemAdmin+ 'parameter-master');
  }
}
