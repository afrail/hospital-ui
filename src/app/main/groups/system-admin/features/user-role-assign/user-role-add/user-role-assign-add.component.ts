import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {DEFAULT_PAGE, DEFAULT_SIZE, DEFAULT_TEXT_AREA_SIZE} from 'app/main/core/constants/constant';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {OK} from 'app/main/core/constants/message';
import {ValidationMessage} from 'app/main/core/constants/validation.message';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {BehaviorSubject} from 'rxjs';
import {UserRole} from '../../../model/user-role';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {AppUtils} from '../../../../../core/utils/app.utils';
import {UserRoleService} from '../../../service/user-role.service';
import {AppUser} from '../../../model/app-user';
import {UserRoleAssignService} from '../../../service/user-role-assign.service';
import {AppUserService} from '../../../service/app-user.service';
import {UserRolePermission} from '../../../model/user-role-permission';
import {Sort} from '@angular/material/sort';
import {PageEvent} from '@angular/material/paginator';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {UserRoleAssignDto} from './request/user-role-assign-dto';
import {UserRoleAssignMaster} from '../../../model/user-role-assign-master';


@Component({
    selector: 'app-user-role-assign-add',
    templateUrl: './user-role-assign-add.component.html',
    styleUrls: ['./user-role-assign-add.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})

export class UserRoleAssignAddComponent implements OnInit {
    // porperty
    disableDelete: boolean;
    editValue: boolean;
    userRolePermission: UserRolePermission;

    textAreaSize: number = DEFAULT_TEXT_AREA_SIZE;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    total: number;
    displayedColumns: string[] = ['appUser', 'status', 'action'];
    searchLoader: boolean = false;
    userRoleSearchLoader: boolean = false;
    listSearchLoader: boolean = false;
    codeLength: number = 6;
    validationMsg: ValidationMessage = new ValidationMessage();
    msgUserActive: string = 'this application user role already assigned !!';

    // object
    frmGroup: FormGroup;
    model: UserRoleAssignDto = new UserRoleAssignDto();
    modelList: UserRoleAssignDto[] = new Array<UserRoleAssignDto>();
    dataSource = new MatTableDataSource(new Array<UserRoleAssignDto>());

    // details properties
    displayColumnsDetails = ['userRole', 'action'];
    dataSourceDetails = new BehaviorSubject<AbstractControl[]>([]);
    rows: FormArray = this.formBuilder.array([]);
    frmGroupDetails: FormGroup = this.formBuilder.group({
        scope: this.rows
    });

    // dropdownList
    appUserDropDownList: AppUser[] = new Array<AppUser>();
    userRoleDropDownList: UserRole[] = new Array<UserRole>();

    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------

    constructor(
        private formBuilder: FormBuilder,
        private modelService: UserRoleAssignService,
        private snackbarHelper: SnackbarHelper,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private appUserService: AppUserService,
        private userRoleService: UserRoleService,
        private appUtils: AppUtils,
    ) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        // this.userRolePermission = this.appUtils.findUserRolePermission();

    }

    ngOnInit(): void {
        this.setFormInitValue();
        this.addRow();
        this.getPageableModelList();
        this.getAppUserList();
        this.getUserRoleList();
        this.getModelList();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ API calling
    // -----------------------------------------------------------------------------------------------------

    getModelList(): void {
        this.listSearchLoader = true;
        this.modelService.getList().subscribe(res => {
            this.modelList = res.data;
            this.listSearchLoader = false;
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
                name: m.username
            }));
        });
    }

    getUserRoleList(): void {
        this.userRoleSearchLoader = true;
        this.userRoleService.getActiveList().subscribe(res => {
            this.userRoleDropDownList = res.data;
            this.userRoleSearchLoader = false;
        });
    }

    onSubmit(): void {
        /*if (!this.userRolePermission.insert) {
            this.appUtils.onFailYourPermision(1);
            return;
        }*/
        if (this.isUserActive(null, this.frmGroup.value.appUser, true)) {
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
       /* if (!this.userRolePermission.edit) {
            this.appUtils.onFailYourPermision(2);
            return;
        }*/
        if (this.isUserActive(this.model.master.appUser.id, this.frmGroup.value.appUser, false)) {
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

    delete(obj: UserRoleAssignDto): any {
       /* if (!this.userRolePermission.delete) {
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

    edit(res: UserRoleAssignDto): void {
        const selectAppUser = this.appUserDropDownList.find(model => model.id === res.master.appUser.id);
        this.disableDelete = true;
        this.editValue = true;
        this.model = res;
        this.frmGroup.setValue({
            appUser: selectAppUser,
            active: res.master.active,
        });

        // details
        this.rows.clear();
        res.detailsList.forEach(value => {
            const selectValue = this.userRoleDropDownList.find(model => model.id === value.userRole.id);
            const row = this.formBuilder.group({
                userRole: [selectValue, Validators.required],
            });
            this.rows.push(row);
        });
        this.updateView();
    }

    resetFromData(): void {
        this.setFormInitValue();
        this.disableDelete = false;
        this.editValue = false;
        this.searchLoader = false;
        // details
        this.rows.clear();
        this.addRow();
        // clear model
        this.model = new UserRoleAssignDto();
    }


    applyFilter(event: Event): void {
        let filterValue = (event.target as HTMLInputElement).value;
        filterValue = filterValue.trim().toLowerCase();
        if (filterValue.length > 0) {
            this.filter(filterValue);
        } else {
            this.getPageableModelList();
            this.getModelList();
        }
    }

    filter(filterValue: string): void {
        const list = [];
        this.modelList.forEach(e => {
            if (
                e.master.appUser.username.toLowerCase().includes(filterValue)
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
                case 'appUser':
                    return this.compare(a.master.appUser.username, b.master.appUser.username, isAsc);
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


    // details method
    addRow(): any {
        const row = this.formBuilder.group({
            userRole: ['', Validators.required]
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

    checkUserRole(row): void {
        const selectValue = row.value.userRole;
        let count = 0;
        this.rows.getRawValue().forEach(e => {
            if (e.userRole.id === selectValue.id) {
                count++;
            }
        });
        if (count > 1) {
            this.snackbarHelper.openErrorSnackBarWithMessage('this item already taken !!', OK);
            row.patchValue({userRole: ''});
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

    generateModel(isCreate: boolean): void {
        // master
        if (isCreate) {
            this.model.master = new UserRoleAssignMaster();
            this.model.master.id = undefined;
        }
        this.model.master.appUser = this.frmGroup.value.appUser;
        this.model.master.active = this.frmGroup.value.active;

        // details
        const detailsList = [];
        this.rows.getRawValue().forEach(e => {
            detailsList.push(e);
        });
        this.model.detailsList = detailsList;
    }

    // details method
    updateView(): any {
        this.dataSourceDetails.next(this.rows.controls);
    }

    openDialog(viewModel: UserRole): void {
        this.appUtils.openConfirmDialog(viewModel, this.delete.bind(this));
        // this.delete.bind(this);
    }

    reloadPage(): void {
        this.resetFromData();
        this.getPageableModelList();
        this.getModelList();
    }

    isUserActive(id: any, appUser: AppUser, isCreate: boolean): boolean {

        for (const obj of this.modelList) {
            // check for update
            if (!isCreate && id === obj.master.appUser.id) {
                continue;
            }
            // console.log(appUser.id === obj.appUser.id);
            if (appUser.id === obj.master.appUser.id) {
                return true;
            }
        }

        return false;
    }

}
