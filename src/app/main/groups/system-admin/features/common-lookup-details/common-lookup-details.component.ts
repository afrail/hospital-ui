import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {DEFAULT_PAGE, DEFAULT_SIZE} from 'app/main/core/constants/constant';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {PageEvent} from '@angular/material/paginator';
import {CommonLookupDetails} from '../../model/common-lookup-details';
import {CommonLookupMaster} from '../../model/common-lookup-master';
import {ValidationMessage} from 'app/main/core/constants/validation.message';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {Sort} from '@angular/material/sort';
import {ActivatedRoute} from '@angular/router';
import {AppUtils} from '../../../../core/utils/app.utils';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {EhmCommonLookupMasterService} from '../../service/ehm-common-lookup-master.service';
import {EhmCommonLookupDetailsService} from '../../service/ehm-common-lookup-details.service';
import {UserRolePermission} from '../../model/user-role-permission';

@Component({
    selector: 'app-common-lookup-details',
    templateUrl: './common-lookup-details.component.html',
    styleUrls: ['./common-lookup-details.component.scss']
})
export class CommonLookupDetailsComponent implements OnInit {

    /*dialog property*/
    @Input() isDialog: boolean;
    @Input() commonLookupId: number;
    @Output() dialogResponse = new EventEmitter<any>();

    // property
    disableDelete: boolean;
    editValue: boolean;
    moduleType: number;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    total: number;
    rationDisplayedColumns: string[] = ['master', 'name', 'banglaName', 'module', 'action'];
    displayedColumns: string[] = ['name', 'banglaName', 'master', 'parent', 'action'];

    codeLength: number = 10;
    validationMsg: ValidationMessage = new ValidationMessage();

    rolePermission: UserRolePermission;
    searchLoader: boolean = false;
    isShow: boolean = false;

    // object
    modelService: any;
    modelMasterService: any;
    frmGroup: FormGroup;
    model: CommonLookupDetails = new CommonLookupDetails();
    modelList: CommonLookupDetails[] = new Array<CommonLookupDetails>();
    modelListParent: CommonLookupDetails[] = new Array<CommonLookupDetails>();
    masterModelList: CommonLookupMaster[] = new Array<CommonLookupMaster>();
    dataSource = new MatTableDataSource(new Array<CommonLookupDetails>());

    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------

    constructor(
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        // EHM
        private ehmCommonLookupMasterService: EhmCommonLookupMasterService,
        private ehmCommonLookupDetailsService: EhmCommonLookupDetailsService,
        private snackbarHelper: SnackbarHelper,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private appUtils: AppUtils
    ) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.rolePermission = this.appUtils.findUserRolePermission();
    }


    ngOnInit(): void {
        this.setFormInitValue();
        this.getModelList();
        this.getMasterModelList();
        this.getPageableModelList();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ API calling
    // -----------------------------------------------------------------------------------------------------
    getModelList(): void {
        this.ehmCommonLookupDetailsService.getList().subscribe(res => {
            this.modelList = res.data;
        });
    }

    getMasterModelList(): void {
        this.ehmCommonLookupMasterService.getActiveList().subscribe(res => {
            this.masterModelList = res.data;
        });
    }

    getPageableModelList(): void {
        this.ehmCommonLookupDetailsService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.data.content);
            this.total = res.data.totalElements;
        });
    }

    onSubmit(): void {

        /*if (!this.rolePermission.insert) {
            this.appUtils.onFailYourPermision(1);
            return;
        }*/

        this.generateModel(true);
        console.log(this.model);
        this.searchLoader = true;
        this.ehmCommonLookupDetailsService.create(this.model).subscribe(res => {
            this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
            this.searchLoader = false;
            if (this.isDialog) {
                this.dialogResponse.emit(res.data);
            }
        }, error => {
            this.appUtils.onServerErrorResponse(error);
            this.searchLoader = false;
        });
    }

    update(): void {

        /*if (!this.rolePermission.edit) {
            this.appUtils.onFailYourPermision(2);
            return;
        }*/
        // if (CommonValidator.isCodeUsed(this.modelList, this.model.id, this.frmGroup.value.code, false)){
        //     this.snackbarHelper.openErrorSnackBarWithMessage(CODE_USED, OK);
        //     return;
        // }
        this.generateModel(false);
        console.log(this.model);
        this.searchLoader = true;
        this.ehmCommonLookupDetailsService.update(this.model).subscribe(res => {
            this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
            this.searchLoader = false;
        }, error => {
            this.appUtils.onServerErrorResponse(error);
            this.searchLoader = false;
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ view method
    // -----------------------------------------------------------------------------------------------------

    delete(obj: CommonLookupDetails): void {
        this.ehmCommonLookupDetailsService.delete(obj).subscribe(res => {
            this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
        }, error => {
            this.appUtils.onServerErrorResponse(error);
        });
    }

    edit(res: CommonLookupDetails): void {
        const selectMasterValue = res.master == null ? '' : this.masterModelList.find(model => model.id === res.master.id);
        const selectValue = res.parent == null ? '' : this.modelList.find(model => model.id === res.parent.id);
        this.disableDelete = true;
        this.editValue = true;
        this.model = res;
        console.log(res);
        this.frmGroup.patchValue({
            name: res.name,
            banglaName: res.banglaName,
            master: selectMasterValue,
            parent: selectValue,
            shortCode: res.shortCode,
            active: res.active,
        });
        this.selectMasterChange();
    }

    resetFromData(): void {
        this.setFormInitValue();
        this.disableDelete = false;
        this.editValue = false;
        this.modelListParent = [];
    }

    applyFilter(event: Event): void {
        let filterValue = (event.target as HTMLInputElement).value;
        filterValue = filterValue.trim().toLowerCase();
        if (filterValue.length > 2) {
            this.filter(filterValue);
        } else if (filterValue.length === 0) {
            this.size = DEFAULT_SIZE;
            this.page = DEFAULT_PAGE;
            this.getPageableModelList();
        }
    }

    filter(filterValue: string): void {
        const list = [];
        this.modelList.forEach(e => {
            const parentName = e.parent ? e.parent.name : '';
            if (e.name.toLowerCase().includes(filterValue) ||
                e.banglaName.toLowerCase().includes(filterValue) ||
                e.master.name.toLowerCase().includes(filterValue) ||
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
                case 'master':
                    return this.compare(a.master.name, b.master.name, isAsc);
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

    onChangePage(event: PageEvent): void {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getPageableModelList();
    }

    selectMasterChange(): void {
        this.modelListParent = [];
        const commonLookupMaster = this.frmGroup.value.master === '' ? null : this.frmGroup.value.master;
        if (commonLookupMaster && commonLookupMaster.parent) {
            for (const val of this.modelList) {
                if (commonLookupMaster.parent.id === val.master.id) {
                    this.modelListParent.push(val);
                }
            }
        }
        // /*add conditional validation*/
        const parent = this.frmGroup.get('parent');
        if (this.modelListParent.length > 0) {
            this.isShow = true;
            parent.setValidators(Validators.required);
        } else {
            this.isShow = false;
            parent.clearValidators();
        }
        parent.updateValueAndValidity();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------
    setFormInitValue(): void {
        this.frmGroup = this.formBuilder.group({
            // code: ['', ''],
            name: ['', Validators.required],
            banglaName: ['', Validators.required],
            master: ['', Validators.required],
            parent: ['', ''],
            shortCode: ['', ''],
            active: [true],
        });
    }

    generateModel(isCreate: boolean): void {
        console.log('hit model');
        if (isCreate) {
            this.model.id = undefined;
        }
        // this.model.code = this.frmGroup.value.code;
        this.model.name = this.frmGroup.value.name;
        this.model.banglaName = this.frmGroup.value.banglaName;
        this.model.master = this.frmGroup.value.master === '' ? undefined : this.frmGroup.value.master;
        this.model.parent = this.frmGroup.value.parent === '' ? undefined : this.frmGroup.value.parent;
        this.model.shortCode = this.frmGroup.value.shortCode;
        this.model.active = this.frmGroup.value.active;

    }

    openDialog(viewModel: CommonLookupDetails): void {
        this.appUtils.openConfirmDialog(viewModel, this.delete.bind(this));

    }

    reloadPage(): void {
        this.resetFromData();
        this.getPageableModelList();
        this.getModelList();
    }


}

