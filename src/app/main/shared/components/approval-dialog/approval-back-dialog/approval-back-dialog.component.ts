import {Component, EventEmitter, Inject, OnInit} from '@angular/core';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ValidationMessage } from 'app/main/core/constants/validation.message';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { AppUtils } from 'app/main/core/utils/app.utils';
import {ApprovalUser} from '../../../../groups/system-admin/model/approval-user';
import {ApprovalHistory} from '../../../../groups/system-admin/model/approval-history';
import {ApprovalHistoryService} from '../../../../groups/system-admin/service/approval-history.service';
import {ApprovalStatusService} from '../../../../groups/system-admin/mock-api/approval-status.service';
import {LocalStorageHelper} from '../../../../core/helper/local-storage.helper';
import {AppUser} from '../../../../groups/system-admin/model/app-user';
import {ApprovalTeam} from '../../../../groups/system-admin/model/approval-team';
import {ApprovalConfigurationService} from '../../../../groups/system-admin/service/approval-configuration.service';


@Component({
    selector: 'app-approval-back-dialog',
    templateUrl: './approval-back-dialog.component.html',
    styleUrls: ['./approval-back-dialog.component.scss']
})
export class ApprovalBackDialogComponent implements OnInit {

    approvalHistory: ApprovalHistory = new ApprovalHistory();
    approvalUser: ApprovalUser;
    commitValue: string;
    callBackMethod: EventEmitter<boolean> = new EventEmitter<boolean>();

    // porperty
    validationMsg: ValidationMessage = new ValidationMessage();

    // object
    frmGroup: FormGroup;
    modelList: ApprovalHistory[] = new Array<ApprovalHistory>();
    model: ApprovalHistory = new ApprovalHistory();

    /*dropdown*/
    approvalTeamDropdownList: ApprovalTeam[] = new Array<ApprovalTeam>();
    appUserDropdownList: AppUser[] = new Array<AppUser>();

    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------

    constructor(
        public dialogRef: MatDialogRef<ApprovalBackDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
        private formBuilder: FormBuilder,
        private modelService: ApprovalHistoryService,
        // private approvalTeamService: ApprovalTeamService,
        private approvalConfigurationService: ApprovalConfigurationService,
        private approvalStatusService: ApprovalStatusService,
        private snackbarHelper: SnackbarHelper,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private appUtils: AppUtils,
        private localStorageHelper: LocalStorageHelper,
    ) {
        this.approvalHistory = data.approvalHistory;
        this.approvalUser = data.approvalUser;
        this.commitValue = data.commitValue;
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.setFormInitValue();
        this.getModelList();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ API calling
    // -----------------------------------------------------------------------------------------------------

    getModelList(): void {
        console.log(this.approvalHistory);
        console.log(this.approvalUser);
        this.modelService.getByTransactionIdAndToApprovalTeamId(
                                                    this.approvalHistory.transactionId,
                                                    this.approvalHistory.transactionTable,
                                                    Number(this.approvalUser.teamid) ).subscribe(res => {


            this.modelList = res.data;
            this.model = this.modelList[0];

            this.getTeamListList();
        });
    }

    /*getTeamListList(): void {
        this.approvalTeamService.getByModuleId(this.model.module.id).subscribe(res => {
            this.approvalTeamDropdownList = res.data.filter(value => value.serialNo < this.model.toApprovalTeam.serialNo);
            /!*patch value*!/
            // const fromTeam: ApprovalTeam = this.model.fromApprovalTeam;
            // const selectValue = fromTeam ?
            //     this.approvalTeamDropdownList.find(model => model.id === fromTeam.id) : '';
            console.log(this.approvalTeamDropdownList[this.approvalTeamDropdownList.length - 1]);
            this.frmGroup.patchValue({
                // toApprovalTeam: selectValue,
                toApprovalTeam: this.approvalTeamDropdownList[this.approvalTeamDropdownList.length - 1],
            });

            /!*working for notify user select*!/
            this.selectChange();
            // const defaultUser = this.nextApprovalConfigurationList.length > 0 ? this.nextApprovalConfigurationList[0].defaultUser : null;
            // const selectDefaultUser = this.model ?
            //     this.appUserDropdownList.find(model => model.id === this.model.fromUserId.id) : '';
            // this.frmGroup.patchValue({ defaultUser: selectDefaultUser});


        });
    }*/

    getTeamListList(): void {
        this.approvalConfigurationService.getByOfficeId('5').subscribe(res => {
            const approvalConfigList = res.data;

            /*get this approval team*/
            const thisApprovalTeamConfig = approvalConfigList.find(
                model => model.toApprovalTeam.id.toString() === this.approvalUser.teamid
            );

            /*work with this team*/
            if (thisApprovalTeamConfig){
                /*set approval team*/
                const tempList = [];
                approvalConfigList.forEach(value => {
                    if (value.serialNo <= thisApprovalTeamConfig.serialNo){
                        tempList.push(value.fromApprovalTeam);
                    }
                });
                this.approvalTeamDropdownList = tempList;

                /*patch value for dropdown*/
                const lastTeam: ApprovalTeam = this.approvalTeamDropdownList[this.approvalTeamDropdownList.length - 1];
                this.frmGroup.patchValue({
                    toApprovalTeam: lastTeam,
                });

                this.selectChange();
            }

        });
    }



    onBack(): any {
        /*now generate model for back*/
        this.model = this.approvalHistory;
        this.model.fromApprovalTeam = this.approvalHistory.toApprovalTeam;
        const appUser: AppUser = this.localStorageHelper.getUserInfo();
        this.model.fromUserId = appUser;
        this.model.fromEmpCode = appUser.employeeCode;

        this.model.approvalStatus = this.approvalStatusService.BACK_ID;
        this.model.toApprovalTeam = this.frmGroup.value.toApprovalTeam;
        this.model.defaultUser = this.frmGroup.value.defaultUser;
        this.model.comment = this.commitValue;

        console.log(this.model);

        this.modelService.create(this.model).subscribe(res => {
            this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
        }, error => {
            this.appUtils.onServerErrorResponse(error);
        });
    }


    // -----------------------------------------------------------------------------------------------------
    // @ view method
    // -----------------------------------------------------------------------------------------------------

    confirm(): void {
        this.onBack();
    }

    onNoClick(): void {
        this.dialogRef.close();
    }

    selectChange(): void{
        this.frmGroup.patchValue({ defaultUser: ''});
        this.appUserDropdownList = [];
        const toApprovalTeam: ApprovalTeam = this.frmGroup.value.toApprovalTeam ? this.frmGroup.value.toApprovalTeam : null;
        if (toApprovalTeam){
            toApprovalTeam.approvalTeamDetailList.forEach(value => {
                this.appUserDropdownList.push(value.appUser);
            });
            this.appUserDropdownList =  this.appUserDropdownList.map( m => ({
                ...m,
                name : m.username + ' (' + m.employeeCode + ')' + ' - ' + m.name
            }));

            if (this.appUserDropdownList.length > 0){
                this.frmGroup.patchValue({ defaultUser: this.appUserDropdownList[0]});
            }

        }
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------

    setFormInitValue(): void {
        this.frmGroup = this.formBuilder.group({
            toApprovalTeam: ['', Validators.required],
            defaultUser: ['', Validators.required],
        });
    }

    reloadPage(): void{
        // this.resetFromData();
        this.onNoClick();
        this.callBackMethod.emit(true);
    }


}
