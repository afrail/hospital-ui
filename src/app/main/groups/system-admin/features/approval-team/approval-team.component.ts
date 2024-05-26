import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {DEFAULT_PAGE, DEFAULT_SIZE, DEFAULT_TEXT_AREA_SIZE} from 'app/main/core/constants/constant';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { PageEvent } from '@angular/material/paginator';
import {DATA_TAKEN, DATA_TAKEN_BN, OK, OK_BN} from 'app/main/core/constants/message';
import { ValidationMessage } from 'app/main/core/constants/validation.message';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {BehaviorSubject} from 'rxjs';
import {Sort} from '@angular/material/sort';
import {ApprovalTeam} from '../../model/approval-team';
import {AppUser} from '../../model/app-user';
import {ApprovalTeamService} from '../../service/approval-team.service';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {AppUtils} from '../../../../core/utils/app.utils';
import {AppUserService} from '../../service/app-user.service';
import {MenuItem} from '../../model/menu-item';
import {MenuItemService} from '../../service/menu-item.service';
import {MenuTypeService} from '../../mock-api/menu-type.service';
import {UserRolePermission} from '../../model/user-role-permission';


@Component({
    selector: 'app-approval-team',
    templateUrl: './approval-team.component.html',
    styleUrls: ['./approval-team.component.scss']
})

export class ApprovalTeamComponent implements OnInit {
    // porperty
    disableDelete: boolean;
    editValue: boolean;

    textAreaSize: number = DEFAULT_TEXT_AREA_SIZE;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    total: number;
    displayedColumns: string[] = ['name', 'banglaName', 'status', 'action'];

    codeLength: number = 6;
    validationMsg: ValidationMessage = new ValidationMessage();
    searchLoader: boolean = false;
    userRolePermission: UserRolePermission;
    // object
    frmGroup: FormGroup;
    model: ApprovalTeam = new ApprovalTeam();
    modelList: ApprovalTeam[] = new Array<ApprovalTeam>();
    dataSource = new MatTableDataSource(new Array<ApprovalTeam>());

    // details properties
    displayColumnsDetails = ['appUser', 'userDetails', 'action'];
    dataSourceDetails = new BehaviorSubject<AbstractControl[]>([]);
    rows: FormArray = this.formBuilder.array([]);
    frmGroupDetails: FormGroup = this.formBuilder.group({
        scope: this.rows
    });

    // dropdownList
    appUserDropDownList: AppUser[] = new Array<AppUser>();
    moduleDropdownList: MenuItem[] = new Array<MenuItem>();

    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------

    constructor(
        private formBuilder: FormBuilder,
        private modelService: ApprovalTeamService,
        private snackbarHelper: SnackbarHelper,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private menuTypeService: MenuTypeService,
        private appUserService: AppUserService,
        private menuItemService: MenuItemService,
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
        this.getModuleList();
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
        this.appUserService.getList().subscribe(res => {
            // console.log(res.data[0].menuItem);
            this.appUserDropDownList = res.data.map(m => ({
                ...m,
                fullName: m.name,
                name : m.username + ' (' + m.employeeCode + ')'
            }));
        });
    }

    getModuleList(): void {
        this.menuItemService.getByItemType(this.menuTypeService.MODULE_ID).subscribe(res => {
            this.moduleDropdownList = res.data;
        });
    }

    onSubmit(): void {
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

    update(): void {
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

    delete(obj: ApprovalTeam): void {
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

    edit(res: ApprovalTeam): void {
        this.disableDelete = true;
        this.editValue = true;
        this.model = res;

        // const selectValueModule = this.moduleDropdownList.find(model => model.id === res.module.id);
        this.frmGroup.setValue({
            // serialNo: res.serialNo,
            // module: selectValueModule,
            name: res.name,
            banglaName: res.banglaName,
            active: res.active,
        });

        // details
        this.rows.clear();
        res.approvalTeamDetailList.forEach(value => {
            const selectValue = this.appUserDropDownList.find(model => model.id === value.appUser.id);
            const row = this.formBuilder.group({
                id: [value.id],
                appUser: [selectValue, Validators.required],
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
        this.model = new ApprovalTeam();
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
                // e.module.name.toLowerCase().includes(filterValue) ||
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
                // case 'module': return this.compare(a.module.name, b.module.name, isAsc);
                // case 'serialNo': return this.compare(a.serialNo, b.serialNo, isAsc);
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

    // details method
    addRow(): any {
        const row = this.formBuilder.group({
            // id: [''],
            appUser: ['', Validators.required]
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
        const selectValue = row.value.appUser;
        // console.log(selectValue);
        let count = 0;
        this.rows.getRawValue().forEach(e => {
            if (e.appUser.id === selectValue.id){ count ++; }
        });
        if (count > 1){
            const dataTaken = this.appUtils.isLocalActive() ? DATA_TAKEN_BN : DATA_TAKEN;
            const ok = this.appUtils.isLocalActive() ? OK_BN : OK;
            this.snackbarHelper.openErrorSnackBarWithMessage(dataTaken, ok);
            row.patchValue({ appUser: '' });
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------
    setFormInitValue(): void {
        this.frmGroup = this.formBuilder.group({
            // serialNo: ['', Validators.required],
            // module: ['', Validators.required],
            name: ['', Validators.required],
            banglaName: ['', ''],
            active: [true],
        });
    }

    generateModel(isCreate: boolean): void{
        // master
        if (isCreate){this.model.id = undefined; }
        // this.model.serialNo = this.frmGroup.value.serialNo;
        // this.model.module = this.frmGroup.value.module;
        this.model.name = this.appUtils.formatSetupFormName(this.frmGroup.value.name);
        this.model.banglaName = this.frmGroup.value.banglaName;
        this.model.active = this.frmGroup.value.active;

        // details
        const detailsList = [];
        this.rows.getRawValue().forEach(e => {
            detailsList.push(e);
        });
        this.model.approvalTeamDetailList = detailsList;
    }

    // details method
    updateView(): any {
        this.dataSourceDetails.next(this.rows.controls);
    }

    openDialog(viewModel: ApprovalTeam): void {
        this.appUtils.openConfirmDialog(viewModel, this.delete.bind(this));

    }

    reloadPage(): void{
        this.resetFromData();
        this.getPageableModelList();
        this.getModelList();
    }

}
