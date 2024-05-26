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
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {AppUtils} from '../../../../core/utils/app.utils';
import {PasswordPolicy} from '../../model/password-policy';
import {PasswordPolicyService} from '../../service/password-policy.service';
import {UserRolePermission} from '../../model/user-role-permission';


@Component({
    selector: 'app-password-policy',
    templateUrl: './password-policy.component.html',
    styleUrls: ['./password-policy.component.scss']
})

export class PasswordPolicyComponent implements OnInit {
    // porperty
    disableDelete: boolean;
    editValue: boolean;

    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    total: number;
    displayedColumns: string[] = ['name', 'minLength', 'passwordRemember', 'passwordAge', 'sequential', 'specialChar',
        'alphanumeric', 'upperLower', 'matchUsername', 'status', 'action'];
    validationMsg: ValidationMessage = new ValidationMessage();
    searchLoader: boolean = false;
    userRolePermission: UserRolePermission;
    // object
    frmGroup: FormGroup;
    model: PasswordPolicy = new PasswordPolicy();
    modelList: PasswordPolicy[] = new Array<PasswordPolicy>();
    dataSource = new MatTableDataSource(new Array<PasswordPolicy>());



    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------

    constructor(
        private formBuilder: FormBuilder,
        private modelService: PasswordPolicyService,
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


    delete(obj: PasswordPolicy): any {
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


    edit(res: PasswordPolicy): any {
        this.disableDelete = true;
        this.editValue = true;
        this.model = res;
        this.frmGroup.setValue({
            name: res.name,
            minLength: res.minLength,
            sequential: res.sequential,
            specialChar: res.specialChar,
            alphanumeric: res.alphanumeric,
            upperLower: res.upperLower,
            matchUsername: res.matchUsername,
            passwordRemember: res.passwordRemember,
            passwordAge: res.passwordAge,
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
                e.name.toLowerCase().includes(filterValue)
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
                case 'name': return this.compare(a.name, b.name, isAsc);
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

    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------

    setFormInitValue(): any {
        this.frmGroup = this.formBuilder.group({
            name: ['', Validators.required],
            minLength: ['', Validators.required],
            sequential: ['', ''],
            specialChar: ['', ''],
            alphanumeric: ['', ''],
            upperLower: ['', ''],
            matchUsername: ['', ''],
            passwordRemember: ['', Validators.required],
            passwordAge: ['', Validators.required],
            active: [true],
        });
    }

    generateModel(isCreate: boolean): any{
        if (isCreate){this.model.id = undefined; }
        this.model.name = this.frmGroup.value.name;
        this.model.minLength = this.frmGroup.value.minLength;
        this.model.sequential = this.frmGroup.value.sequential;
        this.model.specialChar = this.frmGroup.value.specialChar;
        this.model.alphanumeric = this.frmGroup.value.alphanumeric;
        this.model.upperLower = this.frmGroup.value.upperLower;
        this.model.matchUsername = this.frmGroup.value.matchUsername;
        this.model.passwordRemember = this.frmGroup.value.passwordRemember;
        this.model.passwordAge = this.frmGroup.value.passwordAge;
        this.model.active = this.frmGroup.value.active;
    }

    openDialog(viewModel: PasswordPolicy): void {
        this.appUtils.openConfirmDialog(viewModel, this.delete.bind(this));

    }

    reloadPage(): void{
        this.resetFromData();
        this.getPageableModelList();
        this.getModelList();
    }

}
