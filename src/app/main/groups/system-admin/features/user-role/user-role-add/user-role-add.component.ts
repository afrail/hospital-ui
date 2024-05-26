import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {DEFAULT_PAGE, DEFAULT_SIZE, DEFAULT_TEXT_AREA_SIZE} from 'app/main/core/constants/constant';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { PageEvent } from '@angular/material/paginator';
import {OK, CODE_USED, DATA_TAKEN_BN, DATA_TAKEN, OK_BN} from 'app/main/core/constants/message';
import { ValidationMessage } from 'app/main/core/constants/validation.message';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {BehaviorSubject} from 'rxjs';
import {Sort} from '@angular/material/sort';
import {UserRole} from '../../../model/user-role';
import {MenuItemUrl} from '../../../model/menu-item-url';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {MenuItemUrlService} from '../../../service/menu-item-url.service';
import {AppUtils} from '../../../../../core/utils/app.utils';
import {UserRoleService} from '../../../service/user-role.service';
import {CommonValidator} from '../../../../../core/validator/common.validator';
import {UserRolePermission} from '../../../model/user-role-permission';


@Component({
    selector: 'app-user-role-add',
    templateUrl: './user-role-add.component.html',
    styleUrls: ['./user-role-add.component.scss']
})

export class UserRoleAddComponent implements OnInit {
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

    // object
    frmGroup: FormGroup;
    model: UserRole = new UserRole();
    modelList: UserRole[] = new Array<UserRole>();
    dataSource = new MatTableDataSource(new Array<UserRole>());

    // details properties
    displayColumnsDetails = ['menuItemUrl', 'insert', 'edit', 'delete', 'view', 'action'];
    userRolePermission: UserRolePermission;
    dataSourceDetails = new BehaviorSubject<AbstractControl[]>([]);
    rows: FormArray = this.formBuilder.array([]);
    frmGroupDetails: FormGroup = this.formBuilder.group({
        scope: this.rows
    });

    // dropdownList
    menuItemUrlDropDownList: MenuItemUrl[] = new Array<MenuItemUrl>();


    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------

    constructor(
        private formBuilder: FormBuilder,
        private modelService: UserRoleService,
        private snackbarHelper: SnackbarHelper,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private menuItemUrlService: MenuItemUrlService,
        private appUtils: AppUtils,
    ) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        // this.userRolePermission = this.appUtils.findUserRolePermission();
    }

    ngOnInit(): void {
        this.setFormInitValue();
        this.addRow();
        this.getModelList();
        this.getPageableModelList();
        this.getMenuItemUrlList();
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

    getMenuItemUrlList(): void {
        this.menuItemUrlService.getList().subscribe(res => {
            // console.log(res.data[0].menuItem);
            this.menuItemUrlDropDownList = res.data.map(m => ({
                ...m,
                name : m.menuItem.name + ' (' + m.menuItem.parent.name + ')'
                // value.name + ' (' + value.parent.name + ')-' + value.parent.parent.name;
            }));
        });
    }

    onSubmit(): void {
       /* if (!this.userRolePermission.insert){
            this.appUtils.onFailYourPermision(1);
            return;
        }*/
        if (CommonValidator.isCodeUsed(this.modelList, null, this.frmGroup.value.code, true)){
            this.snackbarHelper.openErrorSnackBarWithMessage(CODE_USED, OK);
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
        /*if (!this.userRolePermission.edit){
            this.appUtils.onFailYourPermision(2);
            return;
        }*/
        if (CommonValidator.isCodeUsed(this.modelList, this.model.id, this.frmGroup.value.code, false)){
            this.snackbarHelper.openErrorSnackBarWithMessage(CODE_USED, OK);
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

    delete(obj: UserRole): void {
       /* if (!this.userRolePermission.delete){
            this.appUtils.onFailYourPermision(3);
            return;
        }*/
        this.modelService.delete(obj).subscribe(res => {
            this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
        }, error => {
            this.appUtils.onServerErrorResponse(error);
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ view method
    // -----------------------------------------------------------------------------------------------------

    edit(res: UserRole): void {
        this.disableDelete = true;
        this.editValue = true;
        this.model = res;
        this.frmGroup.setValue({
            code: res.code,
            name: res.name,
            banglaName: res.banglaName,
            active: res.active,
        });

        // details
        this.rows.clear();
        res.rolePermissionList.forEach(value => {
            const selectValue = this.menuItemUrlDropDownList.find(model => model.id === value.menuItemUrl.id);
            const row = this.formBuilder.group({
                id: [value.id],
                menuItemUrl: [selectValue, Validators.required],
                insert: [value.insert, ''],
                edit: [value.edit, ''],
                delete: [value.delete, ''],
                view: [value.view, ''],
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
        this.model = new UserRole();
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
            if (e.code.toLowerCase().includes(filterValue) ||
                e.name.toLowerCase().includes(filterValue) ||
                e.banglaName.toLowerCase().includes(filterValue)
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
                case 'code': return this.compare(a.code, b.code, isAsc);
                case 'name': return this.compare(a.name, b.name, isAsc);
                case 'banglaName': return this.compare(a.banglaName, b.banglaName, isAsc);
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

    get codeField(): any{
        return this.frmGroup.get('code');
    }

    // details method
    addRow(): any {
        const row = this.formBuilder.group({
            // id: [''],
            menuItemUrl: ['', Validators.required],
            insert: [false, ''],
            edit: [false, ''],
            delete: [false, ''],
            view: [true, ''],
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

    checkMenuItem(row): void{
        const selectValue = row.value.menuItemUrl;
        // console.log(selectValue);
        let count = 0;
        this.rows.getRawValue().forEach(e => {
            if (e.menuItemUrl.id === selectValue.id){ count ++; }
        });
        if (count > 1){
            const dataTaken = this.appUtils.isLocalActive() ? DATA_TAKEN_BN : DATA_TAKEN;
            const ok = this.appUtils.isLocalActive() ? OK_BN : OK;
            this.snackbarHelper.openErrorSnackBarWithMessage(dataTaken, ok);
            row.patchValue({ menuItemUrl: '' });
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------
    setFormInitValue(): void {
        this.frmGroup = this.formBuilder.group({
            code: ['', ''],
            name: ['', Validators.required],
            banglaName: ['', Validators.required],
            active: [true],
        });
    }

    generateModel(isCreate: boolean): void{
        // master
        if (isCreate){this.model.id = undefined; }
        this.model.code = this.frmGroup.value.code.replace(/\s/g, '').toUpperCase();
        this.model.name = this.appUtils.formatSetupFormName(this.frmGroup.value.name);
        this.model.banglaName = this.frmGroup.value.banglaName;
        this.model.active = this.frmGroup.value.active;

        // details
        const detailsList = [];
        this.rows.getRawValue().forEach(e => {
            detailsList.push(e);
        });
        this.model.rolePermissionList = detailsList;
    }

    // details method
    updateView(): any {
        this.dataSourceDetails.next(this.rows.controls);
    }

    openDialog(viewModel: UserRole): void {
        this.appUtils.openConfirmDialog(viewModel, this.delete.bind(this));

    }

    reloadPage(): void{
        this.resetFromData();
        this.getPageableModelList();
        this.getModelList();
    }

}
