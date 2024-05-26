import {ReportDataType} from './../../mock-api/report-data-type.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {DEFAULT_PAGE, DEFAULT_SIZE, DEFAULT_TEXT_AREA_SIZE} from 'app/main/core/constants/constant';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {OK} from 'app/main/core/constants/message';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {AppUtils} from 'app/main/core/utils/app.utils';
import {ValidationMessage} from 'app/main/core/constants/validation.message';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {PageEvent} from '@angular/material/paginator';
import {Sort} from '@angular/material/sort';
import {ParameterMaster} from '../../model/parameter-master';
import {ParameterMasterService} from '../../service/parameter-master.service';
import {ReportDataTypeService} from '../../mock-api/report-data-type.service';
import {UserRolePermission} from '../../model/user-role-permission';


@Component({
    selector: 'parameter-master',
    templateUrl: './parameter-master.component.html',
    styleUrls: ['./parameter-master.component.scss']
})

export class ParameterMasterComponent implements OnInit {
    // porperty
    disableDelete: boolean;
    editValue: boolean;
    isListDataType: boolean = false;

    textAreaSize: number = 600;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    total: number;
    displayedColumns: string[] = ['parameterTitle', 'banglaName', 'parameterName', 'dataType', 'sql', 'status', 'action'];
    userRolePermission: UserRolePermission;

    codeLength: number = 4;
    validationMsg: ValidationMessage = new ValidationMessage();

    // object
    frmGroup: FormGroup;
    model: ParameterMaster = new ParameterMaster();
    modelList: ParameterMaster[] = new Array<ParameterMaster>();
    dataSource = new MatTableDataSource(new Array<ParameterMaster>());

    // dropdown
    reportDataTypeDropdownList: ReportDataType[] = new Array<ReportDataType>();

    // sort
    sortedData: ParameterMaster[];
    searchLoader: boolean = false;
    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------

    constructor(
        private formBuilder: FormBuilder,
        private modelService: ParameterMasterService,
        private reportDataTypeService: ReportDataTypeService,
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
        this.getReportDataTypeList();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ API calling
    // -----------------------------------------------------------------------------------------------------

    getModelList(): void {
        this.modelService.getList().subscribe(res => {
            this.modelList = res.data;
        });
    }

    getReportDataTypeList(): any{

        this.reportDataTypeService.getList().forEach(e => {
            this.reportDataTypeDropdownList.push(e);
        });
    }

    getPageableModelList(): void {
        this.modelService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.data.content);
            this.total = res.data.totalElements;
        });
    }

    onSubmit(): any {
        if (!this.userRolePermission.insert) {
            this.appUtils.onFailYourPermision(1);
            return;
        }

        if (this.isNameUsed(this.modelList, null, this.frmGroup.value.parameterName, true)) {
            this.snackbarHelper.openErrorSnackBarWithMessage('Parameter name is already used!', OK);
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
        if (!this.userRolePermission.edit) {
            this.appUtils.onFailYourPermision(2);
            return;
        }
        if (this.isNameUsed(this.modelList, this.model.id, this.frmGroup.value.parameterName, false)) {
            this.snackbarHelper.openErrorSnackBarWithMessage('Parameter name is already used!', OK);
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

    delete(obj: ParameterMaster): any {
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

    edit(res: ParameterMaster): void {
        this.disableDelete = true;
        this.editValue = true;
        if (res.dataType === 'List') {
            this.isListDataType = true;
        } else {
            this.isListDataType = false;
        }
        this.model = res;
        this.frmGroup.setValue({
            parameterTitle: res.parameterTitle,
            banglaName: res.banglaName,
            parameterName: res.parameterName,
            dataTypeList: this.reportDataTypeDropdownList.find(model => model.name === res.dataType),
            sql: res.sql,
            active: res.active,
        });
    }

    resetFromData(): void {
        this.setFormInitValue();
        this.disableDelete = false;
        this.editValue = false;

        //
        this.isListDataType = false;
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
            if (e.parameterTitle.toLowerCase().includes(filterValue) ||
                e.banglaName.toLowerCase().includes(filterValue) ||
                e.parameterName.toLowerCase().includes(filterValue) ||
                e.dataType.toLowerCase().includes(filterValue)
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
                case 'parameterTitle':
                    return this.compare(a.parameterTitle, b.parameterTitle, isAsc);
                case 'banglaName':
                    return this.compare(a.banglaName, b.banglaName, isAsc);
                case 'parameterName':
                    return this.compare(a.parameterName, b.parameterName, isAsc);
                case 'dataType':
                    return this.compare(a.dataType, b.dataType, isAsc);
                default:
                    return 0;
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
            parameterTitle: ['', Validators.required],
            banglaName: ['', Validators.required],
            parameterName: ['', Validators.required],
            dataTypeList: ['', Validators.required],
            sql: ['', ''],
            active: [true],
        });
    }

    generateModel(isCreate: boolean): void {
        if (isCreate) {
            this.model.id = undefined;
        }
        this.model.parameterTitle = this.frmGroup.value.parameterTitle;
        this.model.banglaName = this.frmGroup.value.banglaName;
        this.model.parameterName = this.frmGroup.value.parameterName;
        this.model.dataType = this.frmGroup.value.dataTypeList.name;
        if (this.frmGroup.value.dataTypeList.name === 'List') {
            this.model.sql = this.frmGroup.value.sql;
        } else {
            this.model.sql = '';
        }

        this.model.active = this.frmGroup.value.active;
    }

    openDialog(viewModel: ParameterMaster): void {
        this.appUtils.openConfirmDialog(viewModel, this.delete.bind(this));

    }

    reloadPage(): void {
        this.resetFromData();
        this.getPageableModelList();
        this.getModelList();
    }


    // validation
    isNameUsed(modelList: any, id: any, parameterName: string, isCreate: boolean): boolean {
        for (const obj of modelList) {
            // check for update
            if (!isCreate && id === obj.id) {
                continue;
            }
            const formValue = parameterName.replace(/[^a-zA-Z0-9]/g, ''); // remove special char
            const dbName = obj.parameterName;
            const dbValue = dbName.replace(/[^a-zA-Z0-9]/g, ''); // remove special char
            if (dbValue.toUpperCase() === formValue.replace(/\s/g, '').toUpperCase()) {
                return true;
            }
        }
        return false;
    }


    // for list datatype
    selectDataTypeChange(): void {

        //
        const sql = this.frmGroup.get('sql');

        const dataType = this.frmGroup.value.dataTypeList.name;
        if (dataType === 'List') {
            // validation
            this.isListDataType = true;
            sql.setValidators(Validators.required);

        } else {
            this.isListDataType = false;
            sql.clearValidators();
        }
        sql.updateValueAndValidity();

    }

}

