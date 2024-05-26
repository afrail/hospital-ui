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
import {MenuItemService} from '../../service/menu-item.service';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {AppUtils} from '../../../../core/utils/app.utils';
import { MenuTypeService} from '../../mock-api/menu-type.service';
import {ApprovalConfiguration} from '../../model/approval-configuration';
import {ApprovalConfigurationService} from '../../service/approval-configuration.service';
import {ApprovalTeamService} from '../../service/approval-team.service';
import {AppUser} from '../../model/app-user';
import {ApprovalTeam} from '../../model/approval-team';
import {UserRolePermission} from '../../model/user-role-permission';


@Component({
    selector: 'app-approval-configuration',
    templateUrl: './approval-configuration.component.html',
    styleUrls: ['./approval-configuration.component.scss']
})

export class ApprovalConfigurationComponent implements OnInit {
    // property
    disableDelete: boolean;
    editValue: boolean;

    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    total: number;
    displayedColumns: string[] = ['office', 'serialNo', 'fromApprovalTeam', 'toApprovalTeam', 'defaultUser', 'minAmount', 'maxAmount', 'status', 'action'];

    validationMsg: ValidationMessage = new ValidationMessage();
    userRolePermission: UserRolePermission;

    // object
    frmGroup: FormGroup;
    model: ApprovalConfiguration = new ApprovalConfiguration();
    modelList: ApprovalConfiguration[] = new Array<ApprovalConfiguration>();
    dataSource = new MatTableDataSource(new Array<ApprovalConfiguration>());

    // dropdownList
    // moduleDropdownList: MenuItem[] = new Array<MenuItem>();
    approvalTeamDropdownList: ApprovalTeam[] = new Array<ApprovalTeam>();
    defaultUserDropdownList: AppUser[] = new Array<AppUser>();
    searchLoader: boolean = false;

    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------
    constructor(
        private formBuilder: FormBuilder,
        private modelService: ApprovalConfigurationService,
        private snackbarHelper: SnackbarHelper,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private menuTypeService: MenuTypeService,
        private menuItemService: MenuItemService,
        private approvalTeamService: ApprovalTeamService,
        private appUtils: AppUtils,
    ) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.userRolePermission = this.appUtils.findUserRolePermission();
    }

    ngOnInit(): void {
        this.setFormInitValue();
        this.getModelList();
        this.getPageableModelList();
        this.getOfficeList();
        this.getApprovalTeamList();
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

    /*getModuleList(): void {
        this.menuItemService.getByItemType(this.menuTypeService.MODULE_ID).subscribe(res => {
            this.moduleDropdownList = res.data;
        });
    }*/

    getOfficeList(): void {

    }

    getApprovalTeamList(): void {
        this.approvalTeamService.getActiveList().subscribe(res => {
            this.approvalTeamDropdownList = res.data;
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


    delete(obj: ApprovalConfiguration): any {
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
    edit(res: ApprovalConfiguration): any {
        // const selectOffice = res.office ? this.officeDropdownList.find(model => model.id === res.office.id) : '';
        this.disableDelete = true;
        this.editValue = true;
        this.model = res;
        this.frmGroup.patchValue({
            serialNo: res.serialNo,
            // office: selectOffice,
            minAmount: res.minAmount,
            maxAmount: res.maxAmount,
            active: res.active,
        });

        /*change module dropdown*/
        const selectFromApprovalTeam = res.fromApprovalTeam == null ? '' : this.approvalTeamDropdownList.find(model => model.id === res.fromApprovalTeam.id);
        const selectToApprovalTeam = res.toApprovalTeam == null ? '' : this.approvalTeamDropdownList.find(model => model.id === res.toApprovalTeam.id);
        this.frmGroup.patchValue({
            fromApprovalTeam: selectFromApprovalTeam,
            toApprovalTeam : selectToApprovalTeam,
        });
        /*change toApprovalTeam dropdown*/
        this.selectToApprovalTeamChange();
        const selectDefaultUser = res.defaultUser == null ? '' : this.defaultUserDropdownList.find(model => model.id === res.defaultUser.id);
        this.frmGroup.patchValue({
            defaultUser: selectDefaultUser,
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
        }else {
            this.getPageableModelList();
        }
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
               // case 'office': return this.compare(a.office.name, b.office.name, isAsc);
                case 'serialNo': return this.compare(a.serialNo, b.serialNo, isAsc);
                case 'fromApprovalTeam': return this.compare(a.fromApprovalTeam.name, b.fromApprovalTeam.name, isAsc);
                case 'toApprovalTeam': return this.compare(a.toApprovalTeam.name, b.toApprovalTeam.name, isAsc);
                case 'defaultUser': return this.compare(a.defaultUser.username, b.defaultUser.username, isAsc);
                case 'minAmount': return this.compare(a.minAmount ? a.minAmount : '', b.minAmount ? b.minAmount : '', isAsc);
                case 'maxAmount': return this.compare(a.maxAmount ? a.maxAmount : '', b.maxAmount ? b.maxAmount : '', isAsc);
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

    selectToApprovalTeamChange(): void{
        this.defaultUserDropdownList = [];
        this.frmGroup.patchValue({ defaultUser: '' });
        const selectValue = this.frmGroup.value.toApprovalTeam === '' ? null : this.frmGroup.value.toApprovalTeam;
        if (selectValue){
            this.defaultUserDropdownList = selectValue.approvalTeamDetailList.map(m => ({
                ...m.appUser,
                name : m.appUser.username + ' (' + m.appUser.employeeCode + ')'
            }));
        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------

    setFormInitValue(): any {
        this.frmGroup = this.formBuilder.group({
            serialNo: ['', Validators.required],
            office: ['', Validators.required],
            fromApprovalTeam: ['', Validators.required],
            toApprovalTeam: ['', Validators.required],
            defaultUser: ['', Validators.required],
            minAmount: ['', ''],
            maxAmount: ['', ''],
            active: [true],
        });
    }

    generateModel(isCreate: boolean): any{
        if (isCreate){this.model.id = undefined; }
        this.model.serialNo = this.frmGroup.value.serialNo;
        this.model.fromApprovalTeam = this.frmGroup.value.fromApprovalTeam;
        this.model.toApprovalTeam = this.frmGroup.value.toApprovalTeam;
        this.model.defaultUser = this.frmGroup.value.defaultUser;
        this.model.minAmount = this.frmGroup.value.minAmount;
        this.model.maxAmount = this.frmGroup.value.maxAmount;
        this.model.active = this.frmGroup.value.active;
    }

    openDialog(viewModel: ApprovalConfiguration): void {
        this.appUtils.openConfirmDialog(viewModel, this.delete.bind(this));

    }

    reloadPage(): void{
        this.resetFromData();
        this.getPageableModelList();
        this.getModelList();
    }

}
