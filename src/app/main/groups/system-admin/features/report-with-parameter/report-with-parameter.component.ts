import { ReportMaster } from './../../model/report-master';
import { ReportDataType } from './../../mock-api/report-data-type.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DEFAULT_PAGE, DEFAULT_SIZE, DEFAULT_TEXT_AREA_SIZE } from 'app/main/core/constants/constant';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { AppUtils } from 'app/main/core/utils/app.utils';
import { ValidationMessage } from 'app/main/core/constants/validation.message';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { UserRolePermission } from '../../model/user-role-permission';
import { ReportWithParameter } from '../../model/report-with-parameter';
import { ReportWithParameterService } from '../../service/report-with-parameter.service';
import { ParameterMaster } from '../../model/parameter-master';
import { ReportMasterService } from '../../service/report-master.service';
import { ParameterMasterService } from '../../service/parameter-master.service';


@Component({
    selector: 'repor-wWith-parameter',
    templateUrl: './report-with-parameter.component.html',
    styleUrls: ['./report-with-parameter.component.scss']
})
export class ReportWithParameterComponent implements OnInit {
    // porperty
    disableDelete: boolean;
    editValue: boolean;

    textAreaSize: number = DEFAULT_TEXT_AREA_SIZE;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    total: number;
    displayedColumns: string[] = ['reportMaster', 'module', 'parameterMaster', 'serial', 'required', 'action'];
    userRolePermission: UserRolePermission;

    codeLength: number = 4;
    validationMsg: ValidationMessage = new ValidationMessage();

    // object
    frmGroup: FormGroup;
    model: ReportWithParameter = new ReportWithParameter();
    modelList: ReportWithParameter[] = new Array<ReportWithParameter>();
    dataSource = new MatTableDataSource(new Array<ReportWithParameter>());

    //dropdown
    reportMasterDropdownList: ReportMaster[] = new Array<ReportMaster>();
    parameterMasterDropdownList: ParameterMaster[] = new Array<ParameterMaster>();
    searchLoader: boolean = false;
    //sort
    sortedData: ReportWithParameter[];

    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------

    constructor(
        private formBuilder: FormBuilder,
        private modelService: ReportWithParameterService,
        private reportMasterService: ReportMasterService,
        private parameterMasterService: ParameterMasterService,
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

        //
        this.getReportMasterList();
        this.getParametterMasterList();
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


    getParametterMasterList(): void {
        this.parameterMasterService.getActiveList().subscribe(res => {
            this.parameterMasterDropdownList = res.data.map(m => ({
                ...m,
                name: m.parameterTitle,
            }));
        });
    }

    getPageableModelList(): void {
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

    update(): any {
        if (!this.userRolePermission.edit){
            this.appUtils.onFailYourPermision(2);
            return;
        }
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

    delete(obj: ReportWithParameter): any {
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

    // -----------------------------------------------------------------------------------------------------
    // @ view method
    // -----------------------------------------------------------------------------------------------------

    edit(res: ReportWithParameter): void {
        this.disableDelete = true;
        this.editValue = true;
        this.model = res;
        this.frmGroup.setValue({
            reportMaster: this.reportMasterDropdownList.find(model => model.id === res.reportMaster.id),
            parameterMaster: this.parameterMasterDropdownList.find(model => model.id === res.parameterMaster.id),
            //sql: res.sql,
            required: res.required,
            serial: res.serial,
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
            if (e.reportMaster.reportTitle.toLowerCase().includes(filterValue) ||
                e.parameterMaster.parameterTitle.toLowerCase().includes(filterValue) ||
                e.serial.toString().toLowerCase().includes(filterValue)
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
                case 'reportMaster': return this.compare(a.reportMaster.reportTitle, b.reportMaster.reportTitle, isAsc);
                case 'parameterMaster': return this.compare(a.parameterMaster.parameterTitle, b.parameterMaster.parameterTitle, isAsc);
                case 'serial': return this.compare(a.serial.toString(), b.serial.toString(), isAsc);
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
            reportMaster: ['', Validators.required],
            parameterMaster: ['', ''],
            //sql: ['', ''],
            required : [true],
            serial: ['', Validators.required],
        });
    }

    generateModel(isCreate: boolean): void{
        if (isCreate){this.model.id = undefined; }
        this.model.reportMaster = this.frmGroup.value.reportMaster;
        this.model.parameterMaster = this.frmGroup.value.parameterMaster;
        this.model.sql = '';
        this.model.required = this.frmGroup.value.required;
        this.model.serial = this.frmGroup.value.serial;
    }

    openDialog(viewModel: ReportWithParameter): void {
        this.appUtils.openConfirmDialog(viewModel, this.delete.bind(this));

    }

    reloadPage(): void{
        this.resetFromData();
        this.getPageableModelList();
        this.getModelList();
    }

}

