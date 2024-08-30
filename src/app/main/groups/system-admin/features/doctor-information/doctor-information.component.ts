import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {TranslateService} from '@ngx-translate/core';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {Sort} from '@angular/material/sort';
import {PageEvent} from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUserService } from '../../service/app-user.service';
import {SnackbarHelper} from '../../../../core/helper/snackbar.helper';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {LocalStorageHelper} from '../../../../core/helper/local-storage.helper';
import {AppUtils} from '../../../../core/utils/app.utils';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../core/constants/constant';
import {ValidationMessage} from '../../../../core/constants/validation.message';
import {AppUser} from '../../model/app-user';
import {UserRolePermission} from '../../model/user-role-permission';
import { DoctorInformationService } from '../../service/doctor-information.service';
import {DoctorInformation} from '../../model/doctor-information';
import {OK, OK_BN} from '../../../../core/constants/message';



@Component({
    selector: 'app-doctor-information',
    templateUrl: './doctor-information.component.html',
    styleUrls: ['./doctor-information.component.scss']
})


export class DoctorInformationComponent implements OnInit{

    /*property*/
    menuType: number;
    editValue: boolean;
    disableDelete: boolean;
    searchLoader: boolean = false;
    textAreaSize: number = 500;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    total: number;
    validationMsg: ValidationMessage = new ValidationMessage();
    userInfo: AppUser;
    userRolePermission: UserRolePermission;

    // object
    frmGroup: FormGroup;
    model: DoctorInformation = new DoctorInformation();
    // modelSearch: DoctorInformationSearchParam = new DoctorInformationSearchParam();
    modelList: DoctorInformation[] = new Array<DoctorInformation>();
    dataSource = new MatTableDataSource(this.modelList);
    sortedData: DoctorInformation[] = new Array<DoctorInformation>();
    displayedColumns: string[] = ['sl', 'name', 'doctorRank', 'mobileNumber', 'appUser', 'action'];

    /*Dropdown*/
    appUserDropdownList: AppUser[] = new Array<AppUser>();

    // extra
    storeId: any;
    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------


    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private modelService: DoctorInformationService,
        private appUserService: AppUserService,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private snackbarHelper: SnackbarHelper,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private appUtils: AppUtils,
        private localStorageHelper: LocalStorageHelper,
    ) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.userRolePermission = this.appUtils.findUserRolePermission();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ API calling
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        this.userInfo = this.localStorageHelper.getUserInfo();
        this.activatedRoute.data.subscribe(data => {
            this.menuType = data.pageType;
        });
        this.setFormInitValue();
        this.getAppUserList();
        this.getModelList();
        this.getPageableModelList();
    }


    getAppUserList(): void {
        this.appUserService.getActiveList().subscribe(res => {
            this.appUserDropdownList = res.data.map(m => ({
                ...m,
                name: m.username
            }));
        });
    }

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

    onSubmit(): void {
        if (!this.userRolePermission.insert) {
            this.appUtils.onFailYourPermision(1);
            return;
        }

        if (!this.appUtils.validFromDateToDate(this.frmGroup.value.activeDate, this.frmGroup.value.inactiveDate)) {
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

    // -----------------------------------------------------------------------------------------------------
    // @ view method

    update(): void {
        if (!this.userRolePermission.edit) {
            this.appUtils.onFailYourPermision(2);
            return;
        }

        if (!this.appUtils.validFromDateToDate(this.frmGroup.value.activeDate, this.frmGroup.value.inactiveDate)) {
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

    delete(obj: DoctorInformation): void {
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
    edit(res: DoctorInformation): void {
        this.disableDelete = true;
        this.editValue = true;
        this.model = res;

        const selectValue = res.appUser ? this.appUserDropdownList.find(mode => mode.id === res.appUser.id) : '';

        this.frmGroup.patchValue({
            appUser: selectValue,
            bofEmployee: res.bofEmployee,
            name: res.name,
            banglaName: res.banglaName,
            doctorRank: res.doctorRank,
            mobileNumber: res.mobileNumber,
            specialFor: res.specialFor,
            specialForBangla: res.specialForBangla,
            roomNo: res.roomNo,
            activeDate: res.activeDate,
            inactiveDate: res.inactiveDate
        });
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
            if (

                e.name.toLowerCase().includes(filterValue) ||
                e.doctorRank.toLowerCase().includes(filterValue) ||
                e.mobileNumber.toString().includes(filterValue) ||
                e.appUser.username.toString().includes(filterValue)

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
        this.sortedData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {

                case 'name':
                    return this.compare(a.name, b.name, isAsc);
                case 'doctorRank':
                    return this.compare(a.doctorRank, b.doctorRank, isAsc);
                case 'mobileNumber':
                    return this.compare(a.mobileNumber, b.mobileNumber, isAsc);
                case 'appUser':
                    return this.compare(a.appUser.username, b.appUser.username, isAsc);
                default:
                    return 0;
            }
        });
        this.dataSource = new MatTableDataSource(this.sortedData);
    }

    compare(a: number | string, b: number | string, isAsc: boolean): any {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    onChangePage(event: PageEvent): void {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getPageableModelList();
    }

    resetFromData(): void {
        this.setFormInitValue();
        this.disableDelete = false;
        this.editValue = false;
    }

    openDialog(viewModel: DoctorInformation): void {
        this.appUtils.openConfirmDialog(viewModel, this.delete.bind(this));

    }

    checkUser(): void {
        const selectValue = this.frmGroup.value.appUser;
        if (!selectValue) {
            return;
        }
        for (const obj of this.modelList) {
            if (this.editValue && obj.appUser.id === this.model.appUser.id) {
                continue;
            }
            if (obj.appUser.id === selectValue.id) {
                const message = this.appUtils.isLocalActive() ? 'এই ব্যবহারকারী ইতিমধ্যে লিপিভুক্ত!!' : 'this user already taken !!';
                const ok = this.appUtils.isLocalActive() ? OK_BN : OK;
                this.snackbarHelper.openErrorSnackBarWithMessage(message, ok);
                this.frmGroup.patchValue({appUser: ''});
                break;
            }
        }
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------

    setFormInitValue(): void {

        this.frmGroup = this.formBuilder.group({
            bofEmployee: [false, ''],
            appUser: ['', Validators.required],
            employee: ['', ''],
            name: ['', Validators.required],
            banglaName: ['', ''],
            doctorRank: ['', ''],
            mobileNumber: ['', ''],
            specialFor: ['', ''],
            specialForBangla: ['', ''],
            roomNo: ['', ''],
            activeDate: ['', ''],
            inactiveDate: ['', '']

        });
    }

    generateModel(isCreate: boolean): void {
        if (isCreate) {
            this.model.id = undefined;
        }
        this.model.hosType = this.menuType;
        this.model.bofEmployee = this.frmGroup.value.bofEmployee;
        this.model.appUser = this.frmGroup.value.appUser;
        this.model.name = this.frmGroup.value.name;
        this.model.banglaName = this.frmGroup.value.banglaName;
        this.model.mobileNumber = this.frmGroup.value.mobileNumber;
        this.model.specialFor = this.frmGroup.value.specialFor;
        this.model.specialForBangla = this.frmGroup.value.specialForBangla;
        this.model.roomNo = this.frmGroup.value.roomNo;
        this.model.activeDate = this.frmGroup.value.activeDate;
        this.model.inactiveDate = this.frmGroup.value.inactiveDate;
        this.model.storageId = this.storeId;
    }



    reloadPage(): void {
        this.resetFromData();
        this.getPageableModelList();
        this.getModelList();
    }


}
