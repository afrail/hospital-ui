import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {PageEvent} from '@angular/material/paginator';
import { DATA_ALRADY_USED, IMAGE_VALIDATION_FAILED, OK} from 'app/main/core/constants/message';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import { Sort } from '@angular/material/sort';
import { HttpClient } from '@angular/common/http';
import { DEFAULT_PAGE, DEFAULT_SIZE, DEFAULT_TEXT_AREA_SIZE } from 'app/main/core/constants/constant';
import { ValidationMessage } from 'app/main/core/constants/validation.message';
import { environment } from 'environments/environment';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { AppUtils } from 'app/main/core/utils/app.utils';
import { UserRolePermission } from '../../model/user-role-permission';
import { ReportUpload } from '../../model/report-upload';
import { ReportUploadService } from '../../service/report-upload.service';
import {saveAs as importedSaveAs} from 'file-saver';


@Component({
  selector: 'report-upload',
  templateUrl: './report-upload.component.html',
  styleUrls: ['./report-upload.component.scss']
})
export class ReportUploadComponent  implements OnInit {
    // porperty
    disableDelete: boolean;
    editValue: boolean;
    fileSize: any;
    fileExtensions: any;
    textAreaSize: number = DEFAULT_TEXT_AREA_SIZE;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    total: number;
    displayedColumns: string[] = ['code', 'fileName', 'remarks', 'isSubreport', 'status' , 'action'];
    userRolePermission: UserRolePermission;
    codeLength: number = 4;
    validationMsg: ValidationMessage = new ValidationMessage();

    SERVER_URL =  environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleSystemAdmin + 'report-upload';

    // object
    frmGroup: FormGroup;
    model: ReportUpload = new ReportUpload();
    modelList: ReportUpload[] = new Array<ReportUpload>();
    dataSource = new MatTableDataSource(this.modelList);

    // sort
    sortedData: ReportUpload[];

    // image upload
    fromImageUpload: FormGroup;


    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------
    constructor(
        private formBuilder: FormBuilder,
        private modelService: ReportUploadService,
        private snackbarHelper: SnackbarHelper,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private appUtils: AppUtils,
        private httpClient: HttpClient
    ) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.userRolePermission = this.appUtils.findUserRolePermission();
    }


    ngOnInit(): void {
        this.setFormInitValue();
        this.getModelList();
        this.getPageableModelList();
        this.getValidationCriteria();

        // image upload
        this.fromImageUpload = this.formBuilder.group({
            file: ['']
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ API calling
    // -----------------------------------------------------------------------------------------------------
    getModelList(): void {
        this.modelService.getList().subscribe(res => {
            this.modelList = res.data;
        });
    }


    getPageableModelList(): any {
        this.modelService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.data.content);
            this.total = res.data.totalElements;
        });
    }

    onSubmit(): any {

        if (!this.userRolePermission.insert){
            this.appUtils.onFailYourPermision(1);
            return;
        }


        // data initialize
        this.generateModel(true);

        const file = this.fromImageUpload.get('file').value;
        const fileNameWithoutExt = file.name.split('.').slice(0, -1).join('.');
        const reportObj = {
            id: this.model.id,
            code: this.model.code,
            fileName: fileNameWithoutExt,
            fileNameParams: fileNameWithoutExt,
            remarks: this.model.remarks,
            active: this.model.active,
            isSubreport: this.model.isSubreport
        };

        // file validation
        if (!this.validateFile(file)){
            this.snackbarHelper.openErrorSnackBarWithMessage(IMAGE_VALIDATION_FAILED, OK);
            return;
        }

        // Object validation
        if (this.isDataUsed(this.modelList, null, this.frmGroup.value.code, fileNameWithoutExt, true)){
            this.snackbarHelper.openErrorSnackBarWithMessage(DATA_ALRADY_USED, OK);
            return;
        }

        // form data
        const formData = new FormData();
        formData.append('reportObj', new Blob([JSON.stringify(reportObj)], {
            type: 'application/json',
        }));
        formData.append('file', file);

        // save
        this.httpClient.post<any>(this.SERVER_URL, formData).subscribe(
            (res => {
                this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
                this.getPageableModelList();
            }),
            (err => {
                this.appUtils.onServerErrorResponse(err);
            })
        );
    }


    update(): void {
        if (!this.userRolePermission.edit){
            this.appUtils.onFailYourPermision(2);
            return;
        }


        // data initialize
        this.generateModel(false);
        const file = this.fromImageUpload.get('file').value;
        const fileNameWithoutExt = file.name.split('.').slice(0, -1).join('.');
        const reportObj = {
            id: this.model.id,
            code: this.model.code,
            fileName: fileNameWithoutExt,
            fileNameParams: fileNameWithoutExt,
            remarks: this.model.remarks,
            active: this.model.active,
            isSubreport: this.model.isSubreport
        };

        // file validation
        if (!this.validateFile(file)){
            this.snackbarHelper.openErrorSnackBarWithMessage(IMAGE_VALIDATION_FAILED, OK);
            return;
        }

        // Object validation
        if (this.isDataUsed(this.modelList, this.model.id, this.frmGroup.value.code, fileNameWithoutExt, false)){
            this.snackbarHelper.openErrorSnackBarWithMessage(DATA_ALRADY_USED, OK);
            return;
        }

        // form data
        const formData = new FormData();
        formData.append('reportObj', new Blob([JSON.stringify(reportObj)], {
            type: 'application/json',
        }));
        formData.append('file', file);

        // update
        this.httpClient.put<any>(this.SERVER_URL, formData).subscribe(
            (res => {
                this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
            }),
            (err => {
                this.appUtils.onServerErrorResponse(err);
            })
        );
    }

    delete(obj: ReportUpload): void {
        if (!this.userRolePermission.delete){
            this.appUtils.onFailYourPermision(3);
            return;
        }
        this.modelService.delete(obj).subscribe(res => {
            this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
        }, error => {
            this.appUtils.onServerErrorResponse(error);
        });
    }

    download(obj: ReportUpload): any {
        const filename = obj.fileName;
        this.modelService.downloadFile(filename).subscribe(blob =>
            importedSaveAs(blob, filename)
        );
    }

     // -----------------------------------------------------------------------------------------------------
    // @ view method
    // -----------------------------------------------------------------------------------------------------


    edit(res: ReportUpload): void {
        this.disableDelete = true;
        this.editValue = true;
        this.model = res;
        this.frmGroup.setValue({
            code: res.code,
            remarks: res.remarks,
            active: res.active,
            isSubreport: res.isSubreport,
            file: '',
        });
    }

    resetFromData(): void {
        this.setFormInitValue();
        this.disableDelete = false;
        this.editValue = false;
    }


    applyFilter(event: Event): void {
        let filterValue = (event.target as HTMLInputElement).value;
        filterValue = filterValue.trim().toLowerCase();
        if (filterValue.length > 0) {
            this.filter(filterValue);
        }
        else {
            this.getPageableModelList();
        }
    }

    filter(filterValue: string): void{
        const list = [];
        this.modelList.forEach(e => {
            if (e.code.toLowerCase().includes(filterValue) ||
                e.fileName.toLowerCase().includes(filterValue)
            ) {
                list.push(e);
            }
        });
        this.dataSource = new MatTableDataSource(list);
        this.total = list.length;
    }


    sortData(sort: Sort): void {
        const data = this.dataSource.data.slice();
        if (!sort.active || sort.direction === '') {
            this.dataSource = new MatTableDataSource(data);
            return;
        }
        this.sortedData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'code': return this.compare(a.code, b.code, isAsc);
                case 'fileName': return this.compare(a.fileName, b.fileName, isAsc);
                default: return 0;
            }
        });
        this.dataSource = new MatTableDataSource(this.sortedData);

    }

    compare(a: number | string, b: number | string, isAsc: boolean): any {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    onChangePage(event: PageEvent): void {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getPageableModelList();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------

    setFormInitValue(): void {
        this.frmGroup = this.formBuilder.group({
            code: ['', Validators.required],
            remarks: ['', ''],
            active: [true],
            isSubreport: [false],
            file: ['', Validators.required],
        });
    }


    generateModel(isCreate: boolean): void{
        if (isCreate){
            this.model.id = undefined;
        }
        this.model.code = this.frmGroup.value.code;
        this.model.remarks = this.frmGroup.value.remarks;
        this.model.active = this.frmGroup.value.active;
        this.model.isSubreport = this.frmGroup.value.isSubreport;
    }

    openDialog(viewModel: ReportUpload): void {
        this.appUtils.openConfirmDialog(viewModel, this.delete.bind(this));

    }

    reloadPage(): void{
        this.resetFromData();
        this.getPageableModelList();
        this.getModelList();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Image Related Method
    // -----------------------------------------------------------------------------------------------------

    // onchenge image upload
    onFileSelect(event): any {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            this.fromImageUpload.get('file').setValue(file);

        }
    }



    getValidationCriteria(): void{
        // save
        this.httpClient.get<any>(this.SERVER_URL + '/validation/criteria').subscribe(
            (res => {
                console.log(res.data);
                this.fileSize = res.data.size;
                this.fileExtensions = res.data.extensions;
            }),
            (err => {
                console.log('Can not find validation critaria');
            })
        );
    }


    // validation
    validateFile(file: any): any {

        const extensions = this.fileExtensions;
        const size = this.fileSize; // size in bytes - 10MB

        console.log(this.fileExtensions);

        if (this.validateFileExtension(file, extensions)){
            if (this.validateFileSize(file, size)){
                return true;
            }
        }
        return false;
    }

    validateFileSize(file: any, size: any): any{
        if (file.size > size){
            return false;
        }
        return true;
    }

    validateFileExtension(file: any, extensions: any): any{
        const ext = file.name.substring(file.name.lastIndexOf('.') + 1);

        for (const extension of extensions){
            if (ext.toLowerCase() === extension){
                return true;
            }
        }
        return false;
    }

    // data validation
    isDataUsed(modelList: any, id: any,  code: string, fileName: string,  isCreate: boolean): boolean{
        for (const obj of modelList){
            // check for update
            if (!isCreate && id === obj.id){
                continue;
            }
            const fileNameReq = fileName;
            const fileNameDB = obj.fileName;

            const formValue = code.replace(/\s/g, '').toUpperCase();
            const dbValue = obj.code.replace(/\s/g, '').toUpperCase();
            if (dbValue === formValue || fileNameReq + '.jrxml' === fileNameDB){
                return true;
            }
        }
        return false;
    }

}

