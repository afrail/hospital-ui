import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
    PatientPrescriptionMasterSearchParam
} from '../features/patient-prescription/request/patient-prescription-master-search-param';
import {PatientPrescriptionRequest} from '../features/patient-prescription/request/patient-prescription-request';
import { CrudRequestService } from 'app/main/core/services/crud-request.service';
import { environment } from 'environments/environment';
import {CommonResponseList, CommonResponseObject, CommonResponsePageable} from 'app/main/core/models/common-response';
import {URL_GET_PAGEABLE} from '../../../core/constants/api';
import {PatientPrescriptionMaster} from '../model/patient-prescription-master';



@Injectable({
    providedIn: 'root'
})
export class PatientPrescriptionMasterService extends CrudRequestService<PatientPrescriptionRequest> {

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleEHM + 'patient-prescription-master');
    }

    search(searchParam: PatientPrescriptionMasterSearchParam): Observable<CommonResponseList<any>> {
        return this.http.put<CommonResponseList<any>>(this._BASE_URL + '/' + 'search', searchParam);
    }

    searchPatientId(patient: number): Observable<CommonResponseList<PatientPrescriptionRequest>> {
        return this.http.get<CommonResponseList<PatientPrescriptionRequest>>(this._BASE_URL + '/' + 'search-patient-id/' + patient);
    }

    getChronicPatientLastPrescription(patient: number): Observable<CommonResponseList<PatientPrescriptionRequest>> {
        return this.http.get<CommonResponseList<PatientPrescriptionRequest>>(this._BASE_URL + '/' + 'get-chronic-patient-prescription/' + patient);
    }

    getTemplateList(): Observable<CommonResponseList<PatientPrescriptionRequest>> {
        return this.http.get<CommonResponseList<PatientPrescriptionRequest>>(this._BASE_URL + '/' + 'get-template-list/');
    }

    getByPrescriptionNo(prescriptionNo: string): Observable<CommonResponseList<PatientPrescriptionRequest>> {
        return this.http.get<CommonResponseList<PatientPrescriptionRequest>>(this._BASE_URL + '/' + 'get-by-prescription-no/' + prescriptionNo);
    }

    getPageableListWithMenuType(page: number, size: number, menuType: number): Observable<CommonResponsePageable<any>> {
        return this.http.get<CommonResponsePageable<any>>(this._BASE_URL + '/' + URL_GET_PAGEABLE + '/' + page + '/' + size + '/' + menuType);
    }

    getMasterDetails(searchParam: PatientPrescriptionMaster): Observable<CommonResponseObject<PatientPrescriptionRequest>> {
        return this.http.put<CommonResponseObject<PatientPrescriptionRequest>>(this._BASE_URL + '/' + 'get-prescription-master', searchParam);
    }

    getListWithPage(page: number, size: number): Observable<CommonResponsePageable<any>> {
        return this.httpClient.get<CommonResponsePageable<any>>( this._BASE_URL + '/' + URL_GET_PAGEABLE + '/' + page + '/' + size);
    }




}
