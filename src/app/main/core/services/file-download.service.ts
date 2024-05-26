import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService{

  constructor(private http: HttpClient) {

  }

  downloadFile(filename : string): any {
    return this.http.get(environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint +environment.ibcs.moduleCommon+ 'file/download/' + filename, {responseType: 'blob'});
  }


  printFile(filename : string): any {
    return this.http.get(environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint +environment.ibcs.moduleCommon+ 'file/print/' + filename, {responseType: 'blob'});
  }

}
