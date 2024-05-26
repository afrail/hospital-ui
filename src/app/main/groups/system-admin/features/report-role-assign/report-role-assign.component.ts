import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {DEFAULT_PAGE, DEFAULT_SIZE, DEFAULT_TEXT_AREA_SIZE} from 'app/main/core/constants/constant';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { OK } from 'app/main/core/constants/message';
import { ValidationMessage } from 'app/main/core/constants/validation.message';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {BehaviorSubject} from 'rxjs';
import {Sort} from '@angular/material/sort';
import {PageEvent} from '@angular/material/paginator';
import { UserRolePermission } from '../../model/user-role-permission';
import { ReportRoleAssign } from '../../model/report-role-assign';
import { AppUser } from '../../model/app-user';
import { ReportRole } from '../../model/report-role';
import { ReportRoleAssignService } from '../../service/report-role-assign.service';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { AppUserService } from '../../service/app-user.service';
import { ReportRoleService } from '../../service/report-role.service';
import { AppUtils } from 'app/main/core/utils/app.utils';


@Component({
    selector: 'app-report-role-assign',
    templateUrl: './report-role-assign.component.html',
    styleUrls: ['./report-role-assign.component.scss']
})

export class ReportRoleAssignComponent implements OnInit {

    // porperty
    disableDelete: boolean;
    editValue: boolean;
    userRolePermission: UserRolePermission;

    textAreaSize: number = DEFAULT_TEXT_AREA_SIZE;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    total: number;
    displayedColumns: string[] = ['appUser', 'status', 'action'];

    codeLength: number = 6;
    validationMsg: ValidationMessage = new ValidationMessage();
    msgUserActive: string = 'this application user role already assigned !!';
    searchLoader: boolean = false;
    // object
    frmGroup: FormGroup;
    model: ReportRoleAssign = new ReportRoleAssign();
    modelList: ReportRoleAssign[] = new Array<ReportRoleAssign>();
    dataSource = new MatTableDataSource(new Array<ReportRoleAssign>());

    // details properties
    displayColumnsDetails = ['reportRole', 'action'];
    dataSourceDetails = new BehaviorSubject<AbstractControl[]>([]);
    rows: FormArray = this.formBuilder.array([]);
    frmGroupDetails: FormGroup = this.formBuilder.group({
        scope: this.rows
    });

    // dropdownList
    appUserDropDownList: AppUser[] = new Array<AppUser>();
    reportRoleDropDownList: ReportRole[] = new Array<ReportRole>();

    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------

    constructor(
        private formBuilder: FormBuilder,
        private modelService: ReportRoleAssignService,
        private snackbarHelper: SnackbarHelper,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private appUserService: AppUserService,
        private reportRoleService: ReportRoleService,
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
        this.getAppUserList();
        this.getReportRoleList();
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

    getAppUserList(): void {
        this.appUserService.getActiveList().subscribe(res => {
            this.appUserDropDownList = res.data.map(m => ({
                ...m,
                name : m.username
            }));
        });
    }

    getReportRoleList(): void {
        this.reportRoleService.getActiveList().subscribe(res => {
            const list = [];
            res.data.forEach(e => {

                list.push(e.reportRole);
            });
            this.reportRoleDropDownList = list;

        });
    }

    onSubmit(): void {
        if (!this.userRolePermission.insert){
            this.appUtils.onFailYourPermision(1);
            return;
        }
        if (this.isUserActive(null,  this.frmGroup.value.appUser, true)){
            this.snackbarHelper.openErrorSnackBarWithMessage(this.msgUserActive, OK);
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
        if (this.isUserActive(this.model.appUser.id,  this.frmGroup.value.appUser, false)){
            this.snackbarHelper.openErrorSnackBarWithMessage(this.msgUserActive, OK);
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

        delete(obj: ReportRoleAssign): any {
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

    edit(res: ReportRoleAssign): void {
        const selectAppUser = this.appUserDropDownList.find(model => model.id === res.appUser.id);
        this.disableDelete = true;
        this.editValue = true;
        this.model = res;
        this.frmGroup.setValue({
            appUser: selectAppUser,
            active: res.active,
        });

        // details
        this.rows.clear();
        res.reportRoleList.forEach(value => {
            const selectValue = this.reportRoleDropDownList.find(model => model.id === value.id);
            const row = this.formBuilder.group({
                reportRole: [selectValue, Validators.required],
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
        this.model = new ReportRoleAssign();
    }


    applyFilter(event: Event): void {
        // console.log(this.modelList);
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
            if (
                e.appUser.username.toLowerCase().includes(filterValue)
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
                case 'appUser': return this.compare(a.appUser.username, b.appUser.username, isAsc);
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
            reportRole: ['', Validators.required]
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

    checkReportRole(row): void{
        const selectValue = row.value.reportRole;
        // console.log(selectValue);
        let count = 0;
        this.rows.getRawValue().forEach(e => {
            if (e.reportRole.id === selectValue.id){ count ++; }
        });
        if (count > 1){
            this.snackbarHelper.openErrorSnackBarWithMessage('this item already taken !!', OK);
            row.patchValue({ reportRole: '' });
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------
    setFormInitValue(): void {
        this.frmGroup = this.formBuilder.group({
            appUser: ['', Validators.required],
            active: [true],
        });
    }

    generateModel(isCreate: boolean): void{
        // master
        if (isCreate){this.model.id = undefined; }
        this.model.appUser = this.frmGroup.value.appUser;
        this.model.active = this.frmGroup.value.active;

        // details
        const detailsList = [];
        this.rows.getRawValue().forEach(e => {
            detailsList.push(e.reportRole);
        });
        this.model.reportRoleList = detailsList;
    }

    // details method
    updateView(): any {
        this.dataSourceDetails.next(this.rows.controls);
    }

    openDialog(viewModel: ReportRoleAssign): void {
        this.appUtils.openConfirmDialog(viewModel, this.delete.bind(this));

    }

    reloadPage(): void{
        this.resetFromData();
        this.getPageableModelList();
        this.getModelList();
    }

    isUserActive(id: any,  appUser: AppUser, isCreate: boolean): boolean{
        for (const obj of this.modelList){
            // check for update
            if (!isCreate && id === obj.appUser.id){ continue; }
            // console.log(appUser.id === obj.appUser.id);
            if (appUser.id === obj.appUser.id){
                return true;
            }

        }
        return false;
    }

}
