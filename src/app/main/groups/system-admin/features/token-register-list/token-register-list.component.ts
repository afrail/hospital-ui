import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {ValidationMessage} from 'app/main/core/constants/validation.message';
import {UserRolePermission} from 'app/main/groups/system-admin/model/user-role-permission';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {AppUtils} from 'app/main/core/utils/app.utils';
import {
    NO_DATA_FOUND,
    NO_DATA_FOUND_BN,
    OK,
    OK_BN,
    SUCCESSFULLY_CLOSE,
    SUCCESSFULLY_CLOSE_BN,
    SUCCESSFULLY_OPEN,
    SUCCESSFULLY_OPEN_BN,
} from 'app/main/core/constants/message';
import { TokenRegister } from '../../model/token-register';
import { DoctorInformation } from '../../model/doctor-information';
import {DEFAULT_PAGE, DEFAULT_SIZE} from 'app/main/core/constants/constant';
import {TokenRegisterService} from '../../service/token-register.service';
import {DoctorInformationService} from '../../service/doctor-information.service';
import {PageEvent} from '@angular/material/paginator';



@Component({
    selector: 'app-token-register-list',
    templateUrl: './token-register-list.component.html',
    styleUrls: ['./token-register-list.component.scss']
})
export class TokenRegisterListComponent implements OnInit {

    // property
    prefixUrl: string;
    menuType: number;
    searchLoader: boolean = false;
    validationMsg: ValidationMessage = new ValidationMessage();
    userRolePermission: UserRolePermission;

    // object
    frmGroup: FormGroup;
    modelList: TokenRegister[] = new Array<TokenRegister>();
    dataSource = new MatTableDataSource(this.modelList);
    displayedColumns: string[] = ['sl', 'tokenNumber', 'visitDate', 'patient', 'referToDoctor', 'actionToken', 'action'];

    // dropdown
    doctorDropdownList: DoctorInformation[] = new Array<DoctorInformation>();

    // extra
    storeId: any;
    size: number = 10;
    page: number = DEFAULT_PAGE;
    total: number;
    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------

    constructor(
        private activatedRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private router: Router,
        private modelService: TokenRegisterService,
        private doctorInformationService: DoctorInformationService,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private matDialog: MatDialog,
        private snackbarHelper: SnackbarHelper,
        private appUtils: AppUtils,
    ) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.userRolePermission = this.appUtils.findUserRolePermission();
    }

    ngOnInit(): void {
        this.prefixUrl = this.appUtils.getPrefixUrl();
        this.setFormInitValue();
        this.getDoctorList();
        this.getPageableModelList();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ API calling
    // -----------------------------------------------------------------------------------------------------
    getDoctorList(): void {
        this.doctorInformationService.getActiveList().subscribe(res => {
            this.doctorDropdownList = res.data.map(m => ({
                ...m,
                name: m.name + ' , ' + m.specialFor
            }));
        });
    }




    onSearch(): void {
        if (!this.appUtils.validFromDateToDate(this.frmGroup.value.fromDate, this.frmGroup.value.toDate)) {
            return;
        }
        this.searchLoader = true;
        /*this.modelService.searchTokenRegister(this.model).subscribe(res => {
            this.modelList = res.data;
            this.dataSource = new MatTableDataSource(this.modelList);
            if (this.modelList.length < 1) {
                const no = this.appUtils.isLocalActive() ? NO_DATA_FOUND_BN : NO_DATA_FOUND;
                const ok = this.appUtils.isLocalActive() ? OK_BN : OK;
                this.snackbarHelper.openErrorSnackBarWithMessage(no, ok);
                this.searchLoader = false;
            }
            this.searchLoader = false;
        }, error => {
            this.appUtils.onServerErrorResponse(error);
            this.searchLoader = false;
        });*/
    }

    delete(obj: TokenRegister): void {
        if (!this.userRolePermission.delete) {
            this.appUtils.onFailYourPermision(3);
            return;
        }
        this.modelService.delete(obj).subscribe(res => {
            this.appUtils.onServerSuccessResponse(res, this.getPageableModelList.bind(this));
        }, error => {
            this.appUtils.onServerErrorResponse(error);
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ view method
    // -----------------------------------------------------------------------------------------------------

    edit(res: TokenRegister): void {
        const url = 'token-register/add';
        this.router.navigateByUrl(this.prefixUrl + url,
            {state: res}
        );
    }


    resetFromData(): void {
        this.modelList = [];
        this.getPageableModelList();
        this.setFormInitValue();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------
    setFormInitValue(): void {
        this.frmGroup = this.formBuilder.group({
            doctor: ['', ''],
            hospitalType: ['', ''],
            visitType: ['', ''],
            fromDate: [this.appUtils.getCurrentDate(), ''],
            toDate: [this.appUtils.getCurrentDate(), ''],
            patientCode: ['', ''],
        });
    }

   /* generateModel(): void {
        this.model.doctorId = this.frmGroup.value.doctor ? this.frmGroup.value.doctor.id : 0;
        this.model.fromDate = this.frmGroup.value.fromDate === '' || this.frmGroup.value.toDate === '' ? null : this.frmGroup.value.fromDate;
        this.model.toDate = this.frmGroup.value.fromDate === '' || this.frmGroup.value.toDate === '' ? null : this.frmGroup.value.toDate;
        this.model.patientCode = this.frmGroup.value.patientCode;
        this.model.hospitalType = this.frmGroup.value.hospitalType ? this.frmGroup.value.hospitalType.id : 0;
        this.model.visitType = this.frmGroup.value.visitType ? this.frmGroup.value.visitType.id : 0;
        this.model.hosType = this.menuType;
    }*/

    openDialog(viewModel: TokenRegister): void {
        this.appUtils.openConfirmDialog(viewModel, this.delete.bind(this));
    }

    printReport(row: any): any {
        const moduleId = '416';
        const reportId = '292';
        const params = new Map<string, string>();
        params.set('P_TOKEN_ID', String(row.id));
        params.set('prescription_master_id', String(row.prescriptionMasterId));
        params.set('id', reportId);
        params.set('P_MODULE_ID', moduleId);
        this.appUtils.printReport(params);
    }

    getHrmUrl(): any {
        const subUrl = this.prefixUrl + 'token-register/add';
        return subUrl;
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
                e.referToDoctorName.includes(filterValue) || e.patientName.includes(filterValue)
                || e.tokenNumber.includes(filterValue)
            ) {
                list.push(e);
            }
        });
        this.size = list.length;
        this.page = list.length;
        this.dataSource = new MatTableDataSource(list);
        this.total = list.length;
    }

    onChangePage(event: PageEvent): void {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getPageableModelList();
    }

    getPageableModelList(): void {
        this.modelService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.data.content);
            this.total = res.data.totalElements;
            this.modelList = res.data.content;
        });

    }

}
