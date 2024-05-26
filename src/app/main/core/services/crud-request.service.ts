import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
    URL_GET_PAGEABLE,
    URL_GET_BY_MASTER_ID,
    URL_ACTIVE, URL_GET_BY_ID, URL_GET_SEARCH
} from '../constants/api';
import {CommonResponseList, CommonResponseObject, CommonResponsePageable} from '../models/common-response';


export abstract class CrudRequestService<I> {

    protected constructor(protected httpClient: HttpClient,
                          protected _BASE_URL: string) {
    }

    // common
    create(i: I): Observable<CommonResponseObject<I>> {
        return this.httpClient.post<CommonResponseObject<I>>( this._BASE_URL, i);
    }

    update(i: I): Observable<CommonResponseObject<I>> {
        return this.httpClient.put<CommonResponseObject<I>>( this._BASE_URL, i);
    }

    delete(i: I): Observable<CommonResponseObject<I>> {
        const httpOptions = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' }), body: i
        };
        return this.httpClient.delete<CommonResponseObject<I>>( this._BASE_URL, httpOptions);
    }

    getList(): Observable<CommonResponseList<I>> {
        return this.httpClient.get<CommonResponseList<I>>( this._BASE_URL);
    }

    getActiveList(): Observable<CommonResponseList<I>> {
        return this.httpClient.get<CommonResponseList<I>>( this._BASE_URL + '/' + URL_ACTIVE);
    }

    getListWithPagination(page: number, size: number): Observable<CommonResponsePageable<I>> {
        return this.httpClient.get<CommonResponsePageable<I>>( this._BASE_URL + '/' + URL_GET_PAGEABLE + '/' + page + '/' + size);
    }

    // other
    getListByMasterId(id: number): Observable<CommonResponseList<I>> {
        return this.httpClient.get<CommonResponseList<I>>( this._BASE_URL + '/' + URL_GET_BY_MASTER_ID + '/' + id.toString());
    }

    getObjectById(id: number): Observable<CommonResponseObject<I>> {
        return this.httpClient.get<CommonResponseObject<I>>( this._BASE_URL + '/' + URL_GET_BY_ID + '/' + id.toString());
    }

    getBySearchValue(searchValue: string): Observable<CommonResponseList<I>> {
        return this.httpClient.get<CommonResponseList<I>>(this._BASE_URL + '/' + URL_GET_SEARCH + '/' + searchValue);
    }



}
