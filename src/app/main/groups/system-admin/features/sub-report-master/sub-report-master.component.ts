import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {PageEvent} from '@angular/material/paginator';
import {
    DATA_ALRADY_USED, DATA_ALRADY_USED_BN,
    IMAGE_VALIDATION_FAILED, IMAGE_VALIDATION_FAILED_BN,
    OK,
    OK_BN
} from 'app/main/core/constants/message';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {Sort} from '@angular/material/sort';
import {DEFAULT_PAGE, DEFAULT_SIZE, DEFAULT_TEXT_AREA_SIZE} from 'app/main/core/constants/constant';
import {ValidationMessage} from 'app/main/core/constants/validation.message';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {AppUtils} from 'app/main/core/utils/app.utils';
import {UserRolePermission} from '../../model/user-role-permission';
import {SubReportMaster} from '../../model/sub-report-master';
import {SubReportMasterService} from '../../service/sub-report-master.service';
import {ReportMaster} from '../../model/report-master';
import {ReportMasterService} from '../../service/report-master.service';
import { ReportUpload } from '../../model/report-upload';
import { ReportUploadService } from '../../service/report-upload.service';


@Component({
    selector: 'sub-report-master',
    templateUrl: './sub-report-master.component.html',
    styleUrls: ['./sub-report-master.component.scss']
})
export class SubReportMasterComponent implements OnInit {
    // porperty
    disableDelete: boolean;
    editValue: boolean;

    textAreaSize: number = DEFAULT_TEXT_AREA_SIZE;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    total: number;
    displayedColumns: string[] = ['reportMaster', 'module', 'reportUpload', 'serial', 'status', 'action'];
    userRolePermission: UserRolePermission;
    codeLength: number = 4;
    validationMsg: ValidationMessage = new ValidationMessage();
    searchLoader: boolean = false;
    //object
    frmGroup: FormGroup;
    model: SubReportMaster = new SubReportMaster();
    modelList: SubReportMaster[] = new Array<SubReportMaster>();
    dataSource = new MatTableDataSource(this.modelList);

    //dropdown
    reportMasterDropdownList: ReportMaster[] = new Array<ReportMaster>();
    reportUploadDropdownList: ReportUpload[] = new Array<ReportUpload>();

    //sort
    sortedData: SubReportMaster[];


    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------
    constructor(
        private formBuilder: FormBuilder,
        private modelService: SubReportMasterService,
        private reportMasterService: ReportMasterService,
        private reportUploadService: ReportUploadService,
        private snackbarHelper: SnackbarHelper,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private appUtils: AppUtils,
    ) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.userRolePermission = this.appUtils.findUserRolePermission();
    }


    ngOnInit(): void {
        this.setFormInitValue();
        this.getModelList();
        this.getPageableModelList();
        this.getReportMasterList();
        this.getReportUploadList();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ API calling
    // -----------------------------------------------------------------------------------------------------
    getModelList(): void {
        this.modelService.getList().subscribe(res => {
            this.modelList = res.data;
        });
    }


    getReportMasterList(): void {
        this.reportMasterService.getActiveList().subscribe(res => {
            this.reportMasterDropdownList = res.data.map(m => ({
                ...m,
                name: '(' +m.module.name + ') ' + m.reportTitle,
            }));
        });
    }

    getReportUploadList(): void {
        this.reportUploadService.getAllActiveSubreportList().subscribe(res => {
            this.reportUploadDropdownList = res.data.map(m => ({
                ...m,
                name: '(' + m.code + ') ' + m.fileName.replace('.jrxml', '')
            }));
        });
    }


    getPageableModelList() {
        this.modelService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.data.content);
            this.total = res.data.totalElements;
        });
    }

    onSubmit() {

        if (!this.userRolePermission.insert) {
            this.appUtils.onFailYourPermision(1);
            return;
        }

        //Object validation
        if(this.isDataUsed(this.modelList, null, this.frmGroup.value.reportMaster, this.frmGroup.value.reportUpload, true)){
            this.snackbarHelper.openErrorSnackBarWithMessage(DATA_ALRADY_USED, OK);
            return;
        }

        //data initialize
        this.generateModel(true);
        console.log(this.model);
        this.searchLoader = true;
        this.modelService.create(this.model).subscribe(res => {
            this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
            this.searchLoader = false;
        }, error => {
            this.appUtils.onServerErrorResponse(error);
            this.searchLoader = false;
        });
    }


    update() {
        if (!this.userRolePermission.edit) {
            this.appUtils.onFailYourPermision(2);
            return;
        }

        // Object validation
        if(this.isDataUsed(this.modelList, this.model.id, this.frmGroup.value.reportMaster, this.frmGroup.value.reportUpload, false)){
            this.snackbarHelper.openErrorSnackBarWithMessage(DATA_ALRADY_USED, OK);
            return;
        }

        // data initialize
        this.generateModel(false);
        console.log(this.model);
        this.searchLoader = true;
        this.modelService.update(this.model).subscribe(res => {
            this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
            this.searchLoader = false;
        }, error => {
            this.appUtils.onServerErrorResponse(error);
            this.searchLoader = false;
        });
    }

    delete(obj: SubReportMaster) {
        if (!this.userRolePermission.delete) {
            this.appUtils.onFailYourPermision(3);
            return;
        }
        this.modelService.delete(obj).subscribe(res => {
            this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
        }, error => {
            this.appUtils.onServerErrorResponse(error);
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ view method
    // -----------------------------------------------------------------------------------------------------


    edit(res: SubReportMaster) {
        this.disableDelete = true;
        this.editValue = true;
        this.model = res;
        this.frmGroup.setValue({
            reportMaster: this.reportMasterDropdownList.find(model => model.id === res.reportMaster.id),
            reportUpload: this.reportUploadDropdownList.find(model => model.id === res.reportUpload.id),
            serial: res.serial,
            active: res.active,
        });
    }

    resetFromData() {
        this.setFormInitValue();
        this.disableDelete = false;
        this.editValue = false;
    }


    applyFilter(event: Event): void {
        let filterValue = (event.target as HTMLInputElement).value;
        filterValue = filterValue.trim().toLowerCase();
        if (filterValue.length > 0) {
            this.filter(filterValue);
        } else {
            this.getPageableModelList();
        }
    }

    filter(filterValue: string): void {
        const list = [];
        this.modelList.forEach(e => {
            if (e.reportUpload.fileName.toLowerCase().includes(filterValue) ||
                e.serial.toString().toLowerCase().includes(filterValue) ||
                e.reportMaster.reportTitle.toLowerCase().includes(filterValue)
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
                case 'reportUpload':
                    return this.compare(a.reportUpload.fileName, b.reportUpload.fileName, isAsc);
                case 'serial':
                    return this.compare(a.serial, b.serial, isAsc);
                case 'reportMaster':
                    return this.compare(a.reportMaster.reportTitle, b.reportMaster.reportTitle, isAsc);
                default:
                    return 0;
            }
        });
        this.dataSource = new MatTableDataSource(this.sortedData);

    }

    compare(a: number | string, b: number | string, isAsc: boolean): any {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    onChangePage(event: PageEvent) {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getPageableModelList();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------

    setFormInitValue() {
        this.frmGroup = this.formBuilder.group({
            reportMaster: ['', Validators.required],
            reportUpload: ['', Validators.required],
            serial: ['', Validators.required],
            active: [true],
        });
    }


    generateModel(isCreate: boolean) {
        if (isCreate) {
            this.model.id = undefined;
        }
        this.model.reportMaster = this.frmGroup.value.reportMaster;
        this.model.reportUpload = this.frmGroup.value.reportUpload;
        this.model.serial = this.frmGroup.value.serial;
        this.model.active = this.frmGroup.value.active;
    }

    openDialog(viewModel: SubReportMaster): void {
        this.appUtils.openConfirmDialog(viewModel, this.delete.bind(this));

    }

    reloadPage(): void {
        this.resetFromData();
        this.getPageableModelList();
        this.getModelList();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Image Related Method
    // -----------------------------------------------------------------------------------------------------


    //data validation
    isDataUsed(modelList: any, id: any, reportMaster: any, reportUpload: any,  isCreate: boolean): boolean{
        for (const obj of modelList){
            // check for update
            if (!isCreate && id === obj.id){
                continue;
            }
            const fileNameReq = reportUpload.fileName;
            const fileNameDB = obj.reportUpload.fileName;

            const reportMasterIdReq = reportMaster.id;
            const reportMasterIdDB = obj.reportMaster.id;

            if (fileNameReq == fileNameDB && reportMasterIdReq == reportMasterIdDB){
                return true;
            }
        }
        return false;
    }

}

