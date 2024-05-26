import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FormBuilder} from '@angular/forms';
import { ValidationMessage } from 'app/main/core/constants/validation.message';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import {ApprovalHistory} from '../../../../groups/system-admin/model/approval-history';
import {ApprovalStatus, ApprovalStatusService} from '../../../../groups/system-admin/mock-api/approval-status.service';
import {ApprovalHistoryService} from '../../../../groups/system-admin/service/approval-history.service';
import {AppUserEmployee} from '../../../../groups/system-admin/model/app-user-employee';
import {AppUserEmployeeService} from '../../../../groups/system-admin/service/app-user-employee.service';


@Component({
    selector: 'app-approval-history-dialog',
    templateUrl: './approval-history-dialog.component.html',
    styleUrls: ['./approval-history-dialog.component.scss']
})
export class ApprovalHistoryDialogComponent implements OnInit {

    transactionData: any;
    callBackMethod: EventEmitter<boolean> = new EventEmitter<boolean>();

    // porperty
    validationMsg: ValidationMessage = new ValidationMessage();

    // object
    appUserEmployeeList: AppUserEmployee[] = new Array<AppUserEmployee>();
    approvalStatusList: ApprovalStatus[] = new Array<ApprovalStatus>();
    modelList: ApprovalHistory[] = new Array<ApprovalHistory>();


    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------

    constructor(
        public dialogRef: MatDialogRef<ApprovalHistoryDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
        private formBuilder: FormBuilder,
        private modelService: ApprovalHistoryService,
        private appUserEmployeeService: AppUserEmployeeService,
        private approvalStatusService: ApprovalStatusService,
        private snackbarHelper: SnackbarHelper,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
    ) {
        this.transactionData = data;
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.getApprovalStatusList();
        this.getAppUserEmployee();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ API calling
    // -----------------------------------------------------------------------------------------------------

    getAppUserEmployee(): void {
        this.appUserEmployeeService.getByTransactionTableAndId(this.transactionData.id, this.transactionData.transactionTable).subscribe(res => {
            this.appUserEmployeeList = res.data;
            this.getModelList();
        });
    }

    getModelList(): void {
        console.log(this.transactionData.id);
        console.log(this.transactionData.transactionTable);
        this.modelService.getByTransactionId(this.transactionData.id, this.transactionData.transactionTable).subscribe(res => {
            this.modelList = res.data.map(m => ({
                ...m,
                status: this.approvalStatusList.find(model => model.id === m.approvalStatus),
                fromAppUserEmployee: this.appUserEmployeeList.find(model => model.appUser.id === m.fromUserId.id)
            }));
        });
    }

    getApprovalStatusList(): void {
        this.approvalStatusList = this.approvalStatusService.getList();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ view method
    // -----------------------------------------------------------------------------------------------------

    onNoClick(): void {
        this.dialogRef.close();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------




}
