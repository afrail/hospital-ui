import {Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DEFAULT_PAGE, DEFAULT_SIZE } from 'app/main/core/constants/constant';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import {  PageEvent } from '@angular/material/paginator';
import {
    OK,
} from 'app/main/core/constants/message';
import { ValidationMessage } from 'app/main/core/constants/validation.message';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {Sort} from '@angular/material/sort';
import {MenuItem} from '../../model/menu-item';
import {MenuItemService} from '../../service/menu-item.service';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {AppUtils} from '../../../../core/utils/app.utils';
import {MenuType, MenuTypeService} from '../../mock-api/menu-type.service';
import {UserRolePermission} from '../../model/user-role-permission';


@Component({
    selector: 'app-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.scss']
})

export class MenuItemComponent implements OnInit {
    // porperty
    disableDelete: boolean;
    editValue: boolean;

    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    total: number;
    displayedColumns: string[] = ['name', 'banglaName', 'menuType', 'serialNo', 'parent', 'status', 'action'];
    userRolePermission: UserRolePermission;
    validationMsg: ValidationMessage = new ValidationMessage();
    searchLoader: boolean = false;
    // object
    frmGroup: FormGroup;
    model: MenuItem = new MenuItem();
    modelList: MenuItem[] = new Array<MenuItem>();
    dataSource = new MatTableDataSource(new Array<MenuItem>());

    // dropdownList
    parentDropdownList: MenuItem[] = new Array<MenuItem>();
    menuTypeDropdownList: MenuType[] = new Array<MenuType>();


    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------

    constructor(
        private formBuilder: FormBuilder,
        private modelService: MenuItemService,
        private snackbarHelper: SnackbarHelper,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private menuTypeService: MenuTypeService,
        private appUtils: AppUtils,
    ) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        // this.userRolePermission = this.appUtils.findUserRolePermission();
    }

    ngOnInit(): void {
        this.setFormInitValue();
        this.getModelActiveList();
        this.getModelList();
        this.getPageableModelList();
        this.getMenuTypeList();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ API calling
    // -----------------------------------------------------------------------------------------------------

    getModelActiveList(): any {
        this.modelService.getByItemTypeNot(this.menuTypeService.MENU_ID).subscribe(res => {
            this.parentDropdownList = res.data.map(m => ({
                ...m,
                name: m.name + ' (' + this.menuTypeDropdownList.find(model => model.id === m.menuType).name + ')'
            }));
        });
    }

    getModelList(): any {
        this.modelService.getList().subscribe(res => {
            this.modelList = res.data.map(m => ({
                ...m,
                type: this.menuTypeDropdownList.find(model => model.id === m.menuType)
            }));
        });
    }

    getPageableModelList(): any {
        this.modelService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.data.content.map(m => ({
                ...m,
                type: this.menuTypeDropdownList.find(model => model.id === m.menuType)
            })));
            this.total = res.data.totalElements;
        });
    }

    getMenuTypeList(): any {
        this.menuTypeDropdownList = this.menuTypeService.getList();
    }


    onSubmit(): any {
       /* if (!this.userRolePermission.insert){
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
       /* if (!this.userRolePermission.edit){
            this.appUtils.onFailYourPermision(2);
            return;
        }*/
        this.generateModel(false);

        if (this.model.parent && this.model.id === this.model.parent.id){
            this.snackbarHelper.openErrorSnackBarWithMessage('item and parent both are same', OK);
            return;
        }

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


    delete(obj: MenuItem): any {
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

    // -----------------------------------------------------------------------------------------------------
    // @ view method
    // -----------------------------------------------------------------------------------------------------


    edit(res: MenuItem): any {
        const selectMenuType = res.menuType == null ? '' : this.menuTypeDropdownList.find(model => model.id === res.menuType);
        const selectParent = res.parent == null ? '' : this.parentDropdownList.find(model => model.id === res.parent.id);
        this.disableDelete = true;
        this.editValue = true;
        this.model = res;
        this.frmGroup.setValue({
            name: res.name,
            banglaName: res.banglaName,
            menuType : selectMenuType,
            serialNo: res.serialNo,
            parent : selectParent,
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
            const parentName = e.parent ? e.parent.name : '';
            const menuType = e.type ? e.type.name : '';
            if (
                e.name.toLowerCase().includes(filterValue) ||
                e.banglaName.toLowerCase().includes(filterValue) ||
                parentName.toLowerCase().includes(filterValue) ||
                menuType.toLowerCase().includes(filterValue)
            ) {
                // e.type = this.menuTypeDropdownList.find(model => model.id === e.menuType);
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
            const aValue = a.parent ? a.parent.name : '';
            const bValue = b.parent ? b.parent.name : '';
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'name': return this.compare(a.name, b.name, isAsc);
                case 'banglaName': return this.compare(a.banglaName, b.banglaName, isAsc);
                case 'menuType': return this.compare(a.type ? a.type.name : '', b.type ? b.type.name : '', isAsc);
                case 'serialNo': return this.compare(a.serialNo, b.serialNo, isAsc);
                case 'parent': return this.compare(aValue, bValue, isAsc);
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
            banglaName: ['', Validators.required],
            menuType: ['', Validators.required],
            serialNo: ['', Validators.required],
            parent: ['', ''],
            active: [true],
        });
    }

    generateModel(isCreate: boolean): any{
        if (isCreate){this.model.id = undefined; }
        this.model.name = this.frmGroup.value.name;
        this.model.banglaName = this.frmGroup.value.banglaName;
        this.model.menuType = this.frmGroup.value.menuType.id;
        this.model.serialNo = this.frmGroup.value.serialNo;
        this.model.parent = this.frmGroup.value.parent === '' ? undefined : this.frmGroup.value.parent;
        this.model.active = this.frmGroup.value.active;
    }

    openDialog(viewModel: MenuItem): void {
        this.appUtils.openConfirmDialog(viewModel, this.delete.bind(this));

    }

    reloadPage(): void{
        this.resetFromData();
        this.getPageableModelList();
        this.getModelList();
        this.getModelActiveList();
    }

}
