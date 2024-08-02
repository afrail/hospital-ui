import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {DEFAULT_PAGE, DEFAULT_SIZE} from 'app/main/core/constants/constant';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {PageEvent} from '@angular/material/paginator';
import {
    BANGLA_NAME_USED,
    BN_BANGLA_NAME_USED,
    BN_ENGLISH_NAME_USED,
    ENGLISH_NAME_USED,
    OK,
    OK_BN,
    PARENT_AND_ITEM_SAME,
    PARENT_AND_ITEM_SAME_BN
} from 'app/main/core/constants/message';
import {ValidationMessage} from 'app/main/core/constants/validation.message';
import {CommonValidator} from 'app/main/core/validator/common.validator';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import { UserRolePermission } from '../../model/user-role-permission';
import {ActivatedRoute} from '@angular/router';
import {AppUtils} from '../../../../core/utils/app.utils';
import {Sort} from '@angular/material/sort';
import {CommonLookupMaster} from '../../model/common-lookup-master';
import {EhmCommonLookupMasterService} from '../../service/ehm-common-lookup-master.service';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';



@Component({
    selector: 'common-lookup-master',
    templateUrl: './common-lookup-master.component.html',
    styleUrls: ['./common-lookup-master.component.scss']
})

export class CommonLookupMasterComponent implements OnInit {
    // porperty
    disableDelete: boolean;
    editValue: boolean;
    moduleType: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    total: number;
    rationDisplayedColumns: string[] = ['name', 'banglaName', 'module', 'action'];
    displayedColumns: string[] = ['name', 'banglaName', 'action'];

    validationMsg: ValidationMessage = new ValidationMessage();

    rolePermission: UserRolePermission;
    searchLoader: boolean = false;

    // object
    frmGroup: FormGroup;
    model: CommonLookupMaster = new CommonLookupMaster();
    modelList: CommonLookupMaster[] = new Array<CommonLookupMaster>();
    parentDropdownList: CommonLookupMaster[] = new Array<CommonLookupMaster>();
    dataSource = new MatTableDataSource(new Array<CommonLookupMaster>());

    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------

    constructor(
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private modelService: EhmCommonLookupMasterService,
        private snackbarHelper: SnackbarHelper,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private appUtils: AppUtils,
    ) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.rolePermission = this.appUtils.findUserRolePermission();
    }

    ngOnInit(): void {
        this.setFormInitValue();
        this.getModelActiveList();
        this.getModelList();
        this.getPageableModelList();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ API calling
    // -----------------------------------------------------------------------------------------------------



    getModelActiveList(): any {
        this.modelService.getActiveList().subscribe(res => {
            this.parentDropdownList = res.data;
        });
    }

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

        if (!this.rolePermission.insert) {
            this.appUtils.onFailYourPermision(1);
            return;
        }
        if (CommonValidator.isNameUsed(this.modelList, null, this.frmGroup.value.name, false, true)) {
            const okay = this.appUtils.isLocalActive() ? OK_BN : OK;
            const nameUsed = this.appUtils.isLocalActive() ? BN_ENGLISH_NAME_USED : ENGLISH_NAME_USED;
            this.snackbarHelper.openErrorSnackBarWithMessage(nameUsed, okay);
            return;
        }
        if (CommonValidator.isNameUsed(this.modelList, null, this.frmGroup.value.banglaName, true, true)) {
            const okay = this.appUtils.isLocalActive() ? OK_BN : OK;
            const nameUsed = this.appUtils.isLocalActive() ? BN_BANGLA_NAME_USED : BANGLA_NAME_USED;
            this.snackbarHelper.openErrorSnackBarWithMessage(nameUsed, okay);
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

        if (!this.rolePermission.edit) {
            this.appUtils.onFailYourPermision(2);
            return;
        }
        if (CommonValidator.isNameUsed(this.modelList, this.model.id, this.frmGroup.value.name, false, false)) {
            const okay = this.appUtils.isLocalActive() ? OK_BN : OK;
            const nameUsed = this.appUtils.isLocalActive() ? BN_ENGLISH_NAME_USED : ENGLISH_NAME_USED;
            this.snackbarHelper.openErrorSnackBarWithMessage(nameUsed, okay);
            return;
        }

        if (CommonValidator.isNameUsed(this.modelList, this.model.id, this.frmGroup.value.banglaName, true, false)) {
            const okay = this.appUtils.isLocalActive() ? OK_BN : OK;
            const nameUsed = this.appUtils.isLocalActive() ? BN_BANGLA_NAME_USED : BANGLA_NAME_USED;
            this.snackbarHelper.openErrorSnackBarWithMessage(nameUsed, okay);
            return;
        }


        if (this.frmGroup.value.parent && this.model.id === this.frmGroup.value.parent.id) {
            const ok = this.appUtils.isLocalActive() ? OK_BN : OK;
            const itemAndParentSame = this.appUtils.isLocalActive() ? PARENT_AND_ITEM_SAME_BN : PARENT_AND_ITEM_SAME;
            this.snackbarHelper.openErrorSnackBarWithMessage(itemAndParentSame, ok);
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


    delete(obj: CommonLookupMaster): any {
        if (!this.rolePermission.delete) {
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


    edit(res: CommonLookupMaster): any {
        const selectValue = res.parent == null ? '' : this.parentDropdownList.find(model => model.id === res.parent.id);
        this.disableDelete = true;
        this.editValue = true;
        this.model = res;
        this.frmGroup.patchValue({
            name: res.name,
            banglaName: res.banglaName,
            parent: selectValue,
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
            this.size = DEFAULT_SIZE;
            this.page = DEFAULT_PAGE;
            this.getPageableModelList();
        }
    }

    filter(filterValue: string): void {
        const list = [];
        this.modelList.forEach(e => {
            const parentName = e.parent ? e.parent.name : '';
            if (
                e.name.toLowerCase().includes(filterValue) ||
                e.banglaName.toLowerCase().includes(filterValue) ||
                parentName.toLowerCase().includes(filterValue)
            ) {
                list.push(e);
            }
        });
        this.size = list.length;
        this.page = list.length;
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
                case 'name':
                    return this.compare(a.name, b.name, isAsc);
                case 'banglaName':
                    return this.compare(a.banglaName, b.banglaName, isAsc);
                case 'parent':
                    return this.compare(aValue, bValue, isAsc);
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

    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------

    setFormInitValue(): any {
        this.frmGroup = this.formBuilder.group({
            name: ['', Validators.required],
            banglaName: ['', Validators.required],
            parent: ['', ''],
            active: [true],
        });
    }

    generateModel(isCreate: boolean): any {
        if (isCreate) {
            this.model.id = undefined;
        }
        this.model.name = this.frmGroup.value.name ? this.frmGroup.value.name : null;
        this.model.banglaName = this.frmGroup.value.banglaName ?  this.frmGroup.value.banglaName : null;
        this.model.parent = this.frmGroup.value.parent === '' ? undefined : this.frmGroup.value.parent;
        this.model.subModule = this.frmGroup.value.subModule ? this.frmGroup.value.subModule?.id : null;
        this.model.active = this.frmGroup.value.active;
    }

    openDialog(viewModel: any): void {
        this.appUtils.openConfirmDialog(viewModel, this.delete.bind(this));

    }

    reloadPage(): void {
        this.resetFromData();
        this.getPageableModelList();
        this.getModelList();
        this.getModelActiveList();
    }

}
