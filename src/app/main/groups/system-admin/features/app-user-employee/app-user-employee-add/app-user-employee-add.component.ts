import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DEFAULT_PAGE, DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import {  PageEvent } from '@angular/material/paginator';
import { ValidationMessage } from 'app/main/core/constants/validation.message';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {Sort} from '@angular/material/sort';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {AppUtils} from '../../../../../core/utils/app.utils';
import {AppUserEmployee} from '../../../model/app-user-employee';
import {AppUser} from '../../../model/app-user';
import {AppUserEmployeeService} from '../../../service/app-user-employee.service';
import {AppUserService} from '../../../service/app-user.service';
import {OK} from '../../../../../core/constants/message';
import {UserRolePermission} from '../../../model/user-role-permission';


@Component({
    selector: 'app-app-user-employee-add',
    templateUrl: './app-user-employee-add.component.html',
    styleUrls: ['./app-user-employee-add.component.scss']
})

export class AppUserEmployeeAddComponent implements OnInit {
    // property
    disableDelete: boolean;
    editValue: boolean;
    isBofEmp: boolean = true;
    searchLoader: boolean = false;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    total: number;
    displayedColumns: string[] = ['appUser', 'employeeCode', 'displayName', 'designation', 'activeDate', 'inactiveDate', 'status', 'action'];

    validationMsg: ValidationMessage = new ValidationMessage();
    msgUserActive: string = 'this application user already assigned !!';

    // object
    frmGroup: FormGroup;
    model: AppUserEmployee = new AppUserEmployee();
    modelList: AppUserEmployee[] = new Array<AppUserEmployee>();
    dataSource = new MatTableDataSource(new Array<AppUserEmployee>());
    userRolePermission: UserRolePermission;

    // dropdownList
    appUserDropdownList: AppUser[] = new Array<AppUser>();

    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------

    constructor(
        private formBuilder: FormBuilder,
        private modelService: AppUserEmployeeService,
        private snackbarHelper: SnackbarHelper,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private appUserService: AppUserService,
        private appUtils: AppUtils,
    ) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        // this.userRolePermission = this.appUtils.findUserRolePermission();

        this.userRolePermission = new UserRolePermission();
        this.userRolePermission.insert = true;
        this.userRolePermission.edit = true;
        this.userRolePermission.delete = true;
        this.userRolePermission.view = true;
    }

    ngOnInit(): void {
        this.setFormInitValue();
        this.getModelList();
        this.getPageableModelList();
        this.getAppUserList();

        this.generatePasswordField.valueChanges
            .subscribe(checkedValue => {
                const password = this.passwordField;
                const mobile = this.mobileField;
                const email = this.emailField;
                if (checkedValue){
                    password.clearValidators();
                    mobile.setValidators([Validators.required]);
                    email.setValidators([Validators.required, Validators.email]);
                }else {
                    password.setValidators([Validators.required]);
                    mobile.clearValidators();
                    email.clearValidators();
                    email.setValidators([Validators.email]);
                }
                password.updateValueAndValidity();
                mobile.updateValueAndValidity();
                email.updateValueAndValidity();
            });

    }

    // -----------------------------------------------------------------------------------------------------
    // @ API calling
    // -----------------------------------------------------------------------------------------------------

    getModelList(): any {
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

    getAppUserList(): void {
        this.appUserService.getActiveList().subscribe(res => {
            this.appUserDropdownList = res.data.map(m => ({
                ...m,
                name :  m.username
            }));
        });
    }


    onSubmit(): any {
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


    update(): any {
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



    delete(obj: AppUserEmployee): any {
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


    edit(res: AppUserEmployee): any {

        const selectAppUser = res.appUser == null ? '' : this.appUserDropdownList.find(model => model.id === res.appUser.id);
        // const selectEmployeeInfo = res.employeeInfo == null ? '' : this.empPersonalInfoDropDownList.find(model => model.id === res.employeeInfo.id);

        this.disableDelete = true;
        this.editValue = true;
        this.model = res;

        this.frmGroup.patchValue({
            appUser: selectAppUser,
            // employeeInfo: selectEmployeeInfo,
            employeeCode: res.employeeCode,
            displayName: res.displayName,
            name: res.name,
            banglaName: res.banglaName,
            designation: res.designation,
            activeDate: res.activeDate,
            inactiveDate: res.inactiveDate,
            mobile: res.mobile,
            email: res.email,
            active: res.active,
        });
    }


    resetFromData(): any {
        this.setFormInitValue();
        this.disableDelete = false;
        this.editValue = false;
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
            if (
                e.appUser.username.toLowerCase().includes(filterValue) ||
                e.displayName.toLowerCase().includes(filterValue) ||
                e.employeeCode.toLowerCase().includes(filterValue) ||
                e.designation.toLowerCase().includes(filterValue)
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
                case 'menuItem': return this.compare(a.name, b.name, isAsc);
                default: return 0;
            }
        });
        this.dataSource = new MatTableDataSource(sortedData);
    }

    compare(a: number | string, b: number | string, isAsc: boolean): any {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }


    onChangePage(event: PageEvent): any {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getPageableModelList();
    }

    selectEmployeeChange(): void{
        const empInfo =  this.frmGroup.value.employeeInfo;
        this.frmGroup.patchValue({
            employeeCode: empInfo ? empInfo.code : '',
            name: empInfo ? empInfo.employeeName : '',
            banglaName: empInfo ? empInfo.employeeNameBangla : '',
            designation: empInfo ? empInfo.employeeOfficialInformation.designation.name : '',
        });
    }

    selectIsBofEmployeeChange(): void{
        this.isBofEmp = !this.isBofEmp;
        this.frmGroup.patchValue({
            employeeInfo: '',
        });
        this.selectEmployeeChange();
    }

    get emailField(): any{
        return this.frmGroup.get('email');
    }

    /*get activeField(): any{
        return this.frmGroup.get('active');
    }*/
    get inactiveDateField(): any{
        return this.frmGroup.get('inactiveDate');
    }

    get generatePasswordField(): any{
        return this.frmGroup.get('generatePassword');
    }

    get passwordField(): any{
        return this.frmGroup.get('password');
    }

    get mobileField(): any{
        return this.frmGroup.get('mobile');
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------

    setFormInitValue(): any {
        this.frmGroup = this.formBuilder.group({
            appUser: ['', Validators.required],
            employeeInfo: ['', ''],
            employeeCode: ['', Validators.required],
            displayName: ['', Validators.required],
            name: ['', Validators.required],
            banglaName: ['', Validators.required],
            designation: ['', Validators.required],
            mobile: ['', ''],
            email: ['', Validators.email],
            activeDate: ['', Validators.required],
            inactiveDate: ['', ''],
            password: ['', Validators.required],
            generatePassword: [false],
            active: [true],
        });
    }

    generateModel(isCreate: boolean): any{
        if (isCreate){this.model.id = undefined; }
        this.model.appUser = this.frmGroup.value.appUser;
       // this.model.employeeInfo = this.frmGroup.value.employeeInfo ? this.frmGroup.value.employeeInfo : null;
        this.model.employeeCode = this.frmGroup.value.employeeCode;
        this.model.displayName = this.frmGroup.value.displayName;
        this.model.name = this.frmGroup.value.name;
        this.model.banglaName = this.frmGroup.value.banglaName;
        this.model.designation = this.frmGroup.value.designation;
        this.model.mobile = this.frmGroup.value.mobile;
        this.model.email = this.frmGroup.value.email;
        this.model.activeDate = this.frmGroup.value.activeDate;
        this.model.inactiveDate = this.frmGroup.value.inactiveDate;
        this.model.password = this.frmGroup.value.password;
        this.model.generatePassword = this.frmGroup.value.generatePassword;
        this.model.active = this.frmGroup.value.active;
    }

    openDialog(viewModel: AppUserEmployee): void {
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
            console.log(appUser.active);
            console.log(appUser.id === obj.appUser.id);
            if (obj.active && appUser.id === obj.appUser.id){
                console.log('inside');
                return true;
            }

        }
        return false;
    }



}
