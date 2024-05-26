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
import {MenuItem} from '../../model/menu-item';
import {MenuItemService} from '../../service/menu-item.service';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {AppUtils} from '../../../../core/utils/app.utils';
import {MenuItemUrl} from '../../model/menu-item-url';
import {MenuItemUrlService} from '../../service/menu-item-url.service';
import {COUNTRY_ID} from '../../../../core/constants/common-lookup.constant';
import {MenuTypeService} from '../../mock-api/menu-type.service';
import {OK} from '../../../../core/constants/message';



@Component({
    selector: 'app-menu-item-url',
    templateUrl: './menu-item-url.component.html',
    styleUrls: ['./menu-item-url.component.scss']
})

export class MenuItemUrlComponent implements OnInit {
    // porperty
    disableDelete: boolean;
    editValue: boolean;

    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    total: number;
    displayedColumns: string[] = ['menuItem', 'baseURL', 'view', 'insert', 'edit', 'delete', 'status', 'action'];
    validationMsg: ValidationMessage = new ValidationMessage();

    // object
    frmGroup: FormGroup;
    model: MenuItemUrl = new MenuItemUrl();
    modelList: MenuItemUrl[] = new Array<MenuItemUrl>();
    dataSource = new MatTableDataSource(new Array<MenuItemUrl>());

    // dropdownList
    menuItemDropdownList: MenuItem[] = new Array<MenuItem>();

    searchLoader: boolean = false;
    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------

    constructor(
        private formBuilder: FormBuilder,
        private modelService: MenuItemUrlService,
        private snackbarHelper: SnackbarHelper,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private menuTypeService: MenuTypeService,
        private menuItemService: MenuItemService,
        private appUtils: AppUtils,
    ) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        // this.userRolePermission = this.appUtils.findUserRolePermission();
    }

    ngOnInit(): void {
        this.setFormInitValue();
        this.getModelList();
        this.getPageableModelList();
        this.getMenuItemListByParentId();
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

    getMenuItemListByParentId(): void {
        this.menuItemService.getByItemType(this.menuTypeService.MENU_ID).subscribe(res => {
            // const tempList = [];
            // res.data.forEach(value => {
            //     value.name = value.name + ' (' + value.parent.name + ')-' + value.parent.parent.name;
            //     tempList.push(value);
            // });
            this.menuItemDropdownList = res.data.map(m => ({
                ...m,
                name : m.name + ' (' + m.parent.name + ')-' + m.parent.parent.name
            }));
        });
    }

    onSubmit(): any {
        /*if (!this.userRolePermission.insert){
            this.appUtils.onFailYourPermision(1);
            return;
        }*/
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
        /*if (!this.userRolePermission.edit){
            this.appUtils.onFailYourPermision(2);
            return;
        }*/
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


    delete(obj: MenuItemUrl): any {
        /*if (!this.userRolePermission.delete){
            this.appUtils.onFailYourPermision(3);
            return;
        }*/
        this.modelService.delete(obj).subscribe(res => {
            this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
        }, error => {
            this.appUtils.onServerErrorResponse(error);
        });
    }

    checkMenuItem(): void{
        const selectValue = this.frmGroup.value.menuItem;
        for (const obj of this.modelList){
            if (this.editValue && obj.id === this.model.id){
                continue;
            }
            if (obj.menuItem.id === selectValue.id){
                this.snackbarHelper.openErrorSnackBarWithMessage('this item already added !!', OK);
                this.frmGroup.patchValue({ menuItem: '' });
                break;
            }
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ view method
    // -----------------------------------------------------------------------------------------------------


    edit(res: MenuItemUrl): any {
        const selectValue = res.menuItem == null ? '' : this.menuItemDropdownList.find(model => model.id === res.menuItem.id);
        this.disableDelete = true;
        this.editValue = true;
        this.model = res;
        this.frmGroup.setValue({
            menuItem: selectValue,
            baseURL: res.baseURL,
            insert: res.insert,
            edit: res.edit,
            delete: res.delete,
            view: res.view,
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
                e.menuItem.name.toLowerCase().includes(filterValue) ||
                e.baseURL.toLowerCase().includes(filterValue)
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
                case 'menuItem': return this.compare(a.menuItem.name, b.menuItem.name, isAsc);
                case 'baseURL': return this.compare(a.baseURL, b.baseURL, isAsc);
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
            menuItem: ['', Validators.required],
            baseURL: ['', Validators.required],
            insert: ['', ''],
            edit: ['', ''],
            delete: ['', ''],
            view: [true, ''],
            active: [true],
        });
    }

    generateModel(isCreate: boolean): any{
        if (isCreate){this.model.id = undefined; }
        this.model.menuItem = this.frmGroup.value.menuItem;
        this.model.baseURL = this.frmGroup.value.baseURL;
        this.model.insert = this.frmGroup.value.insert;
        this.model.edit = this.frmGroup.value.edit;
        this.model.delete = this.frmGroup.value.delete;
        this.model.view = this.frmGroup.value.view;
        this.model.active = this.frmGroup.value.active;
    }

    openDialog(viewModel: MenuItem): void {
        this.appUtils.openConfirmDialog(viewModel, this.delete.bind(this));

    }

    reloadPage(): void{
        this.resetFromData();
        this.getPageableModelList();
        this.getModelList();
    }



}
