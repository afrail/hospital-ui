import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {CrudRequestService} from '../../../../core/services/crud-request.service';
import {ManagmentDashboard} from '../model/managment-dashboard';
import {environment} from '../../../../../../environments/environment';

/**
 * @Project   bof-erp-ui
 * @Author    Md. Mizanur Rahman - 598
 * @Mail      mizanur.rahman@ibcs-primax.com
 * @Since     April 13, 2022
 * @version   1.0.0
 */
@Injectable({
    providedIn: 'root'
})
export class ManagmentDashboardService extends CrudRequestService<ManagmentDashboard> {

    constructor(private http: HttpClient) {
        super(http, environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleCommon + 'managment-dashboard');
    }

    getDashboardData(): Observable<any> {
        return this.http.get<any>(this._BASE_URL + '/json-data');
    }

    downloadFile(filename: string): any {
        return this.http.get(this._BASE_URL + '/download/' + filename, {responseType: 'blob'});
    }


    printFile(filename: string): any {
        return this.http.get(this._BASE_URL + '/print/' + filename, {responseType: 'blob'});
    }

    printLifeTimeActivities(filename: string): any {
        return this.http.get(this._BASE_URL + '/LifeTimeActivities/' + filename, {responseType: 'blob'});
    }

}
