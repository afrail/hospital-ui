import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {FormBuilder} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {locale as lngEnglish} from '../../i18n/en';
import {locale as lngBangla} from '../../i18n/bn';
import {PatientPrescriptionRequest} from '../../request/patient-prescription-request';
import {TokenRegister} from '../../../../model/token-register';
import {ValidationMessage} from '../../../../../../core/constants/validation.message';
import {UserRolePermission} from '../../../../model/user-role-permission';
import {SnackbarHelper} from '../../../../../../core/helper/snackbar.helper';
import {FuseTranslationLoaderService} from '../../../../../../core/services/translation-loader.service';
import {AppUtils} from '../../../../../../core/utils/app.utils';
import {PatientPrescriptionMasterService} from '../../../../service/patient-prescription-master.service';
import {EhmUtils} from '../../../utils/ehm.utils';

@Component({
    selector: 'app-prescription-history-dailog',
    templateUrl: './prescription-history-dailog.component.html',
    styleUrls: ['./prescription-history-dailog.component.scss']
})
export class PrescriptionHistoryDailogComponent implements OnInit {


    flag: number;
    patientId: number;
    callBackMethod: EventEmitter<boolean> = new EventEmitter<boolean>();
    searchLoader: boolean = false;
    // porperty
    editValue: boolean;
    textAreaSize: number = 1000;
    validationMsg: ValidationMessage = new ValidationMessage();

    // table column

    // object
    model: TokenRegister = new TokenRegister();
    modelList: PatientPrescriptionRequest[];
    userRolePermission: UserRolePermission;

    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------

    constructor(
        public dialogRef: MatDialogRef<PrescriptionHistoryDailogComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
        private formBuilder: FormBuilder,
        private modelService: PatientPrescriptionMasterService,
        private snackbarHelper: SnackbarHelper,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private appUtils: AppUtils,
        public ehmUtils: EhmUtils,
    ) {
        this.patientId = data.patId;
        this.flag = data.flag;
        this.model = data.tokenInfo;
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.getPrescription();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ API calling
    // -----------------------------------------------------------------------------------------------------

    getPrescription(): void {
        this.modelService.searchPatientId(this.patientId).subscribe(res => {
            this.modelList = res.data;
            console.log(this.modelList);
        });
    }


    // -----------------------------------------------------------------------------------------------------
    // @ view method
    // -----------------------------------------------------------------------------------------------------

    resetFromData(): void {
        this.editValue = false;
    }


    onNoClick(): void {
        this.dialogRef.close();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------

}
