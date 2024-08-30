import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {locale as lngEnglish} from '../i18n/en';
import {locale as lngBangla} from '../i18n/bn';
import {PatientPrescriptionMasterService} from '../../../service/patient-prescription-master.service';
import {PatientPrescriptionMaster} from '../../../model/patient-prescription-master';
import {PatientPrescriptionMasterSearchParam} from '../request/patient-prescription-master-search-param';
import {PatientPrescriptionRequest} from '../request/patient-prescription-request';

import {DoctorInformationService} from '../../../service/doctor-information.service';
import {DoctorInformation} from '../../../model/doctor-information';
import {PageEvent} from '@angular/material/paginator';
import {ValidationMessage} from '../../../../../core/constants/validation.message';
import {UserRolePermission} from '../../../model/user-role-permission';
import {AppUser} from '../../../model/app-user';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../../core/constants/constant';
import {FuseTranslationLoaderService} from '../../../../../core/services/translation-loader.service';
import {SnackbarHelper} from '../../../../../core/helper/snackbar.helper';
import {EhmUtils} from '../../utils/ehm.utils';
import {AppUtils} from '../../../../../core/utils/app.utils';
import {LocalStorageHelper} from '../../../../../core/helper/local-storage.helper';
import {
    TOKEN_REGISTER_DENTAL_ID,
    TOKEN_REGISTER_EMERGENCY_ID,
    TOKEN_REGISTER_ID
} from '../../../../../core/constants/type';
import {NO_DATA_FOUND, NO_DATA_FOUND_BN, OK, OK_BN} from '../../../../../core/constants/message';

@Component({
    selector: 'patient-prescription-list',
    templateUrl: './patient-prescription-list.component.html',
    styleUrls: ['./patient-prescription-list.component.scss']
})
export class PatientPrescriptionListComponent implements OnInit {

    // property
    prefixUrl: string;
    menuType: number;
    searchLoader: boolean = false;
    validationMsg: ValidationMessage = new ValidationMessage();
    userRolePermission: UserRolePermission;

    // object
    frmGroup: FormGroup;
    model: PatientPrescriptionMasterSearchParam = new PatientPrescriptionMasterSearchParam();
    modelList: PatientPrescriptionMaster[] = new Array<PatientPrescriptionMaster>();
    dataSource = new MatTableDataSource(this.modelList);
    displayedColumns: string[] = ['sl', 'prescriptionNo', 'prescriptionDate', 'patientInfo', 'doctorInfo', 'action'];

    // dropdown
    doctorDropdownList: DoctorInformation[] = new Array<DoctorInformation>();

    // extra
    appUser: AppUser;
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
        private modelService: PatientPrescriptionMasterService,
        private doctorInformationService: DoctorInformationService,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private matDialog: MatDialog,
        private snackbarHelper: SnackbarHelper,
        private ehmUtils: EhmUtils,
        private appUtils: AppUtils,
        private localStorageHelper: LocalStorageHelper
    ) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.userRolePermission = this.appUtils.findUserRolePermission();
    }

    ngOnInit(): void {
        this.prefixUrl = this.appUtils.getPrefixUrl();
        this.activatedRoute.data.subscribe(data => {
            this.menuType = data.menuType;
        });
        this.appUser = this.localStorageHelper.getUserInfo();
        this.setFormInitValue();
        this.getDoctorList();
        this.getPageableModelList();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ API calling
    // -----------------------------------------------------------------------------------------------------

    getDoctorList(): void {
        this.doctorInformationService.getActiveList().subscribe(res => {
            this.doctorDropdownList = res.data;
            this.getDoctorInfo();
        });
    }

    getDoctorInfo(): void {
        this.doctorInformationService.getByAppUserId(this.localStorageHelper.getUserInfo().id).subscribe(res => {
            const docInfo: DoctorInformation = res.data;
            const selectDoc = docInfo ? this.doctorDropdownList.find(model => model.id === docInfo.id) : '';
            this.frmGroup.patchValue({
                doctor: selectDoc ? selectDoc : ''
            });
        });
    }

    onSearch(): void {
        if (!this.appUtils.validFromDateToDate(this.frmGroup.value.fromDate, this.frmGroup.value.toDate)) {
            return;
        }
        this.generateModel();
        console.log(this.model);
        this.searchLoader = true;
        this.modelService.search(this.model).subscribe(res => {
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
        });
    }

    delete(obj: PatientPrescriptionRequest): void {
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

    edit(model: PatientPrescriptionMaster): void {
        const url = 'patient-prescription/add';
        this.modelService.getMasterDetails(model).subscribe(res => {
            if (res.data){
                this.router.navigateByUrl(this.prefixUrl + url,
                    {
                        state: {
                            flag: 2,
                            res: res.data
                        }
                    }
                );
            }
        });

    }

    setSearchValue(res: PatientPrescriptionMasterSearchParam): void {
        this.frmGroup.patchValue({
            fromDate: res.fromDate,
            toDate: res.toDate,
        });
    }

    resetFromData(): void {
        this.model = new PatientPrescriptionMasterSearchParam();
        this.modelList = [];
        this.getPageableModelList();
        // this.dataSource = new MatTableDataSource(this.modelList);
        this.setFormInitValue();
    }



    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------
    setFormInitValue(): void {
        this.frmGroup = this.formBuilder.group({
            doctor: ['', ''],
            fromDate: ['', ''],
            toDate: ['', ''],
            patientCode: ['', ''],
            prescriptionNo: ['', ''],
        });
    }

    generateModel(): void {
        this.model.doctorId = this.frmGroup.value.doctor ? this.frmGroup.value.doctor.id : 0;
        this.model.fromDate = this.frmGroup.value.fromDate === '' || this.frmGroup.value.toDate === '' || this.frmGroup.value.patientCode ?
            null : this.frmGroup.value.fromDate;
        this.model.toDate = this.frmGroup.value.fromDate === '' || this.frmGroup.value.toDate === '' || this.frmGroup.value.patientCode ?
            null : this.frmGroup.value.toDate;
        this.model.patientCode = this.frmGroup.value.patientCode;
        this.model.prescriptionNo = this.frmGroup.value.prescriptionNo ? this.frmGroup.value.prescriptionNo : '';
        this.model.hosType = this.menuType;
    }

    openDialog(viewModel: PatientPrescriptionMaster): void {
        this.appUtils.openConfirmDialog(viewModel, this.delete.bind(this));
    }

/*    printReportCoronic(row: any): any {
        const moduleId = '416';
        const reportId = '292';
        const params = new Map<string, string>();
        params.set('P_TOKEN_ID', row.tokenRegisterId);
        params.set('prescription_master_id', row.id);
        params.set('id', reportId);
        params.set('P_MODULE_ID', moduleId);
        this.appUtils.printReport(params);
    }*/

    printReport(row: any): any {
        const moduleId = '8';
        const reportId = '1';
        const params = new Map<string, string>();
        params.set('P_PRES_ID', row.id.toString());
        params.set('id', reportId);
        params.set('P_MODULE_ID', moduleId);
        this.appUtils.printReport(params);
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
                e.patientInfo.patientName.includes(filterValue)
                || e.prescriptionNo.includes(filterValue)
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
        this.modelService.getListWithPage(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.data.content);
            this.total = res.data.totalElements;
            this.modelList = res.data.content;
        });

    }


    serchPrescription(): void {
        const btnElement = document.getElementById('search');
        btnElement.focus();
    }
}
