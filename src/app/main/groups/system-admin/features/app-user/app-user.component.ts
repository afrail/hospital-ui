import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {DEFAULT_PAGE, DEFAULT_SIZE} from 'app/main/core/constants/constant';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {PageEvent} from '@angular/material/paginator';
import {ValidationMessage} from 'app/main/core/constants/validation.message';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {Sort} from '@angular/material/sort';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {AppUtils} from '../../../../core/utils/app.utils';
import {AppUser} from '../../model/app-user';
import {PasswordPolicy} from '../../model/password-policy';
import {PasswordPolicyService} from '../../service/password-policy.service';
import {AppUserService} from '../../service/app-user.service';
import {OK} from '../../../../core/constants/message';
import {CommonValidator} from '../../../../core/validator/common.validator';
import {UserRolePermission} from '../../model/user-role-permission';
import {BILLING_OFFICE_ID} from '../../../../core/constants/common-lookup.constant';


@Component({
    selector: 'app-app-user',
    templateUrl: './app-user.component.html',
    styleUrls: ['./app-user.component.scss']
})

export class AppUserComponent implements OnInit {

    // property
    disableDelete: boolean;
    editValue: boolean;

    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    total: number;
    displayedColumns: string[] = ['username', 'passwordPolicy', 'employeeCode', 'office', 'billingOffice', 'status', 'action'];
    searchLoader: boolean = false;
    validationMsg: ValidationMessage = new ValidationMessage();
    msgUserNameTaken: string = 'username already taken !!';
    msgInvalidUserName: string = 'invalid user name !!';

    // object
    frmGroup: FormGroup;
    model: AppUser = new AppUser();
    modelList: AppUser[] = new Array<AppUser>();
    dataSource = new MatTableDataSource(new Array<AppUser>());
    userRolePermission: UserRolePermission;

    // dropdownList
    passwordPolicyDropdownList: PasswordPolicy[] = new Array<PasswordPolicy>();


    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------

    constructor(
        private formBuilder: FormBuilder,
        private modelService: AppUserService,
        private snackbarHelper: SnackbarHelper,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private passwordPolicyService: PasswordPolicyService,
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
        this.getPasswordPolicyList();
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

    getPasswordPolicyList(): any {
        this.passwordPolicyService.getActiveList().subscribe(res => {
            this.passwordPolicyDropdownList = res.data;
        });
    }

    onSubmit(): any {
        if (!this.userRolePermission.insert) {
            this.appUtils.onFailYourPermision(1);
            return;
        }
        if (CommonValidator.isContainsAnySpecialChar(this.frmGroup.value.username)) {
            this.snackbarHelper.openErrorSnackBarWithMessage(this.msgInvalidUserName, OK);
            return;
        }
        if (this.isNameUsed(null, this.frmGroup.value.username, true)) {
            this.snackbarHelper.openErrorSnackBarWithMessage(this.msgUserNameTaken, OK);
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
        if (CommonValidator.isContainsAnySpecialChar(this.frmGroup.value.username)) {
            this.snackbarHelper.openErrorSnackBarWithMessage(this.msgInvalidUserName, OK);
            return;
        }
        if (this.isNameUsed(this.model.id, this.frmGroup.value.username, false)) {
            this.snackbarHelper.openErrorSnackBarWithMessage(this.msgUserNameTaken, OK);
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


    delete(obj: AppUser): any {
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


    edit(res: AppUser): any {
        const selectValue = res.passwordPolicy == null ? '' : this.passwordPolicyDropdownList.find(model => model.id === res.passwordPolicy.id);
        this.disableDelete = true;
        this.editValue = true;
        this.model = res;
        this.frmGroup.patchValue({
            username: res.username,
            password: res.password,
            confirmPassword: '',
            passwordPolicy: selectValue,
            email: res.email,
            mobile: res.mobile,
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
        } else {
            this.getPageableModelList();
        }
    }

    filter(filterValue: string): void {
        const list = [];
        this.modelList.forEach(e => {
            const employeeCodeName = e.employeeCode ? e.employeeCode : '';
            if (
                e.username.toLowerCase().includes(filterValue) ||
                employeeCodeName.toLowerCase().includes(filterValue) ||
                e.passwordPolicy.name.toLowerCase().includes(filterValue)
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
                case 'username':
                    return this.compare(a.username, b.username, isAsc);
                case 'passwordPolicy':
                    return this.compare(a.passwordPolicy.name, b.passwordPolicy.name, isAsc);
                default:
                    return 0;
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

    get emailField(): any {
        return this.frmGroup.get('email');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------

    setFormInitValue(): any {
        this.frmGroup = this.formBuilder.group({
            passwordPolicy: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', Validators.email],
            mobile: ['', ''],
            password: ['', ''],
            confirmPassword: ['', ''],
            active: [true],
        });
    }

    generateModel(isCreate: boolean): any {
        if (isCreate) {
            this.model.id = undefined;
        }
        this.model.passwordPolicy = this.frmGroup.value.passwordPolicy;
        this.model.username = this.frmGroup.value.username;
        this.model.email = this.frmGroup.value.email;
        this.model.mobile = this.frmGroup.value.mobile;
        this.model.password = this.frmGroup.value.password;
        this.model.active = this.frmGroup.value.active;
    }

    openDialog(viewModel: AppUser): void {
        this.appUtils.openConfirmDialog(viewModel, this.delete.bind(this));

    }

    reloadPage(): void {
        this.resetFromData();
        this.getPageableModelList();
        this.getModelList();
    }

    isNameUsed(id: any, userName: string, isCreate: boolean): boolean {
        for (const obj of this.modelList) {
            // check for update
            if (!isCreate && id === obj.id) {
                continue;
            }
            const formValue = userName.replace(/[^a-zA-Z0-9]/g, ''); // remove special char
            const dbValue = obj.username.replace(/[^a-zA-Z0-9]/g, ''); // remove special char
            if (dbValue.toUpperCase() === formValue.replace(/\s/g, '').toUpperCase()) {
                return true;
            }
        }
        return false;
    }

}
