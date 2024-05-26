import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {DEFAULT_PAGE, DEFAULT_SIZE, DEFAULT_TEXT_AREA_SIZE} from 'app/main/core/constants/constant';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { PageEvent } from '@angular/material/paginator';
import {OK, CODE_USED, DATA_TAKEN_BN, DATA_TAKEN, OK_BN, NAME_USED, BANGLA_NAME_USED} from 'app/main/core/constants/message';
import { ValidationMessage } from 'app/main/core/constants/validation.message';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {BehaviorSubject} from 'rxjs';
import {Sort} from '@angular/material/sort';
import { ReportMaster } from '../../model/report-master';
import { ReportRoleService } from '../../service/report-role.service';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { ReportMasterService } from '../../service/report-master.service';
import { AppUtils } from 'app/main/core/utils/app.utils';
import { UserRolePermission } from '../../model/user-role-permission';
import { CommonValidator } from 'app/main/core/validator/common.validator';
import { ReportRoleRequest } from './request/report-role-request';
import { ReportRole } from '../../model/report-role';


@Component({
    selector: 'app-report-role',
    templateUrl: './report-role.component.html',
    styleUrls: ['./report-role.component.scss']
})

export class ReportRoleComponent implements OnInit {

    // porperty
    disableDelete: boolean;
    editValue: boolean;
    searchLoader: boolean = false;
    textAreaSize: number = DEFAULT_TEXT_AREA_SIZE;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    total: number;
    displayedColumns: string[] = [ 'name', 'banglaName', 'status', 'action'];

    codeLength: number = 6;
    validationMsg: ValidationMessage = new ValidationMessage();
    userRolePermission: UserRolePermission;

    // object
    frmGroup: FormGroup;
    model: ReportRoleRequest = new ReportRoleRequest();
    modelList: ReportRoleRequest[] = new Array<ReportRoleRequest>();
    dataSource = new MatTableDataSource(new Array<ReportRoleRequest>());

    // details properties
    displayColumnsDetails = ['report', 'action'];
    dataSourceDetails = new BehaviorSubject<AbstractControl[]>([]);
    rows: FormArray = this.formBuilder.array([]);
    frmGroupDetails: FormGroup = this.formBuilder.group({
        scope: this.rows
    });

    // dropdownList
    reportMasterList: ReportMaster[] = new Array<ReportMaster>();


    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------

    constructor(
        private formBuilder: FormBuilder,
        private modelService: ReportRoleService,
        private snackbarHelper: SnackbarHelper,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private reportMasterService: ReportMasterService,
        private appUtils: AppUtils,
    ) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.userRolePermission = this.appUtils.findUserRolePermission();
    }

    ngOnInit(): void {
        this.setFormInitValue();
        this.addRow();
        this.getModelList();
        this.getPageableModelList();
        this.getReportMasterList();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ API calling
    // -----------------------------------------------------------------------------------------------------

    getModelList(): void {
        this.modelService.getList().subscribe(res => {
            this.modelList = res.data;
        });
    }

    getPageableModelList(): void {
        this.modelService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.data.content);
            this.total = res.data.totalElements;
        });
    }

    getReportMasterList(): void {
        this.reportMasterService.getActiveList().subscribe(res => {
            this.reportMasterList = res.data.map(m => ({
                ...m,
                name: '(' +m.module.name + ') ' + m.reportTitle
            }));
        });
    }

    onSubmit(): void {
        if (!this.userRolePermission.insert){
            this.appUtils.onFailYourPermision(1);
            return;
        }

        if (this.isNameUsed(this.modelList, null, this.frmGroup.value.name, false , true)){
            this.snackbarHelper.openErrorSnackBarWithMessage(NAME_USED, OK);
            return;
        }

        if (this.isNameUsed(this.modelList, null, this.frmGroup.value.banglaName, true , true)){
            this.snackbarHelper.openErrorSnackBarWithMessage(BANGLA_NAME_USED, OK);
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

    update(): void {
        if (!this.userRolePermission.edit){
            this.appUtils.onFailYourPermision(2);
            return;
        }

        if (this.isNameUsed(this.modelList, this.model.reportRole.id, this.frmGroup.value.name, false, false)){
            this.snackbarHelper.openErrorSnackBarWithMessage(NAME_USED, OK);
            return;
        }

        if (this.isNameUsed(this.modelList, this.model.reportRole.id, this.frmGroup.value.banglaName, true, false)){
            this.snackbarHelper.openErrorSnackBarWithMessage(BANGLA_NAME_USED, OK);
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

    delete(obj: ReportRoleRequest): void {
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

    edit(res: ReportRoleRequest): void {
        this.disableDelete = true;
        this.editValue = true;
        this.model = res;
        this.frmGroup.setValue({
            name: res.reportRole.name,
            banglaName: res.reportRole.banglaName,
            active: res.reportRole.active,
        });

        // details
        this.rows.clear();
        res.reportPermission.forEach(value => {
            const selectValue = this.reportMasterList.find(model => model.id === value.report.id);
            const row = this.formBuilder.group({
                id: [value.id],
                report: [selectValue, Validators.required],
            });
            this.rows.push(row);
        });
        this.updateView();
    }

    resetFromData(): void {
        this.setFormInitValue();
        this.disableDelete = false;
        this.editValue = false;
        // details
        this.rows.clear();
        this.addRow();
        // clear model
        this.model = new ReportRoleRequest();
    }

    applyFilter(event: Event): void {
        let filterValue = (event.target as HTMLInputElement).value;
        filterValue = filterValue.trim().toLowerCase();
        if (filterValue.length > 0) {
            this.filter(filterValue);
        }else {
            this.getPageableModelList();
        }
    }

    filter(filterValue: string): void{
        const list = [];
        this.modelList.forEach(e => {
            if (e.reportRole.name.toLowerCase().includes(filterValue) ||
                e.reportRole.banglaName.toLowerCase().includes(filterValue)
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
        const sortedData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'name': return this.compare(a.reportRole.name, b.reportRole.name, isAsc);
                case 'banglaName': return this.compare(a.reportRole.banglaName, b.reportRole.banglaName, isAsc);
                default: return 0;
            }
        });
        this.dataSource = new MatTableDataSource(sortedData);
    }

    compare(a: number | string, b: number | string, isAsc: boolean): any {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    onChangePage(event: PageEvent): void {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getPageableModelList();
    }

    // details method
    addRow(): any {
        const row = this.formBuilder.group({
            // id: [''],
            report: ['', Validators.required],
        });
        this.rows.push(row);
        this.updateView();
    }

    deleteRow(index): any {
        if (this.rows.length === 1) {
            return false;
        } else {
            this.rows.removeAt(index);
            this.updateView();
            return true;
        }
    }

    reportValidation(row): void{
        const selectValue = row.value.report;
        // console.log(selectValue);
        let count = 0;
        this.rows.getRawValue().forEach(e => {
            if (e.report.id === selectValue.id){ count ++; }
        });
        if (count > 1){
            const dataTaken = this.appUtils.isLocalActive() ? DATA_TAKEN_BN : DATA_TAKEN;
            const ok = this.appUtils.isLocalActive() ? OK_BN : OK;
            this.snackbarHelper.openErrorSnackBarWithMessage(dataTaken, ok);
            row.patchValue({ report: '' });
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------
    setFormInitValue(): void {
        this.frmGroup = this.formBuilder.group({
            name: ['', Validators.required],
            banglaName: ['', Validators.required],
            active: [true],
        });
    }

    generateModel(isCreate: boolean): void{
        const master = isCreate ? new ReportRole() : this.model.reportRole;
        if (isCreate) {
            master.id = undefined;
        }

        master.name = this.appUtils.formatSetupFormName(this.frmGroup.value.name);
        master.banglaName = this.frmGroup.value.banglaName;
        master.active = this.frmGroup.value.active;
        this.model.reportRole = master;

        // details
        const detailsList = [];
        this.rows.getRawValue().forEach(e => {
            detailsList.push(e);
        });
        this.model.reportPermission = detailsList;
    }

    // details method
    updateView(): any {
        this.dataSourceDetails.next(this.rows.controls);
    }

    openDialog(viewModel: ReportRoleRequest): void {
        this.appUtils.openConfirmDialog(viewModel, this.delete.bind(this));

    }

    reloadPage(): void{
        this.resetFromData();
        this.getPageableModelList();
        this.getModelList();
    }


    isNameUsed(modelList: any, id: any,  name: string, isBanglaName: boolean, isCreate: boolean): boolean{
        for (const obj of modelList){
            // check for update
            if (!isCreate && id === obj.reportRole.id){
                continue;
            }
            const formValue = isBanglaName ? name : name.replace(/[^a-zA-Z0-9]/g, ''); // remove special char
            const dbName = isBanglaName ? obj.reportRole.banglaName : obj.reportRole.name;
            const dbValue = isBanglaName ? dbName : dbName.replace(/[^a-zA-Z0-9]/g, ''); // remove special char
            if (dbValue.toUpperCase() === formValue.replace(/\s/g, '').toUpperCase()){
                return true;
            }
        }
        return false;
    }

}
