import {Component, EventEmitter, Inject, Input, OnInit} from '@angular/core';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ValidationMessage } from 'app/main/core/constants/validation.message';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig, MatDialog} from '@angular/material/dialog';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import {Router} from '@angular/router';
import {ApprovalBackDialogComponent} from '../approval-back-dialog/approval-back-dialog.component';
import {ApprovalHistory} from '../../../../groups/system-admin/model/approval-history';
import {ApprovalUser} from '../../../../groups/system-admin/model/approval-user';
import {MenuItem} from '../../../../groups/system-admin/model/menu-item';
import {ApprovalConfiguration} from '../../../../groups/system-admin/model/approval-configuration';
import {ApprovalHistoryService} from '../../../../groups/system-admin/service/approval-history.service';
import {ApprovalConfigurationService} from '../../../../groups/system-admin/service/approval-configuration.service';
import {ApprovalStatus, ApprovalStatusService} from '../../../../groups/system-admin/mock-api/approval-status.service';
import {AppUtils} from '../../../../core/utils/app.utils';
import {LocalStorageHelper} from '../../../../core/helper/local-storage.helper';
import {AppUser} from '../../../../groups/system-admin/model/app-user';
import {ConfirmDialogConstant} from '../../../constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../submit-confirmation-dialog/submit-confirmation-dialog.component';
import {ApprovalSubmitProperty} from '../../../../core/models/approval-submit-property';
import {ApprovalTeamService} from '../../../../groups/system-admin/service/approval-team.service';
import {ApprovalTeam} from '../../../../groups/system-admin/model/approval-team';
import {ApprovalTeamDetails} from '../../../../groups/system-admin/model/approval-team-details';


@Component({
    selector: 'app-approval-submit-dialog',
    templateUrl: './approval-submit-dialog.component.html',
    styleUrls: ['./approval-submit-dialog.component.scss']
})
export class ApprovalSubmitDialogComponent implements OnInit {


    // property
    isSubmitUser: boolean = false;
    validationMsg: ValidationMessage = new ValidationMessage();
    textAreaSize: number = 4000;

    // input property
    @Input() callBackMethod: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Input() approvalHistory: ApprovalHistory;
    // @Input() module: MenuItem;
    // @Input() office: CommonLookupDetails;
    @Input() approvalUser: ApprovalUser;
    @Input() approvalSubmitProperty: ApprovalSubmitProperty;


    // object
    frmGroup: FormGroup;
    model: ApprovalHistory = new ApprovalHistory();
    approvalStatusList: ApprovalStatus[] = new Array<ApprovalStatus>();
    nextApprovalTeamConfig: ApprovalConfiguration;

    /*dropdown*/
    approvalTeamDropdownList: ApprovalTeam[] = new Array<ApprovalTeam>();
    appUserDropdownList: AppUser[] = new Array<AppUser>();

    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------

    constructor(
        public dialogRef: MatDialogRef<ApprovalSubmitDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data: any,
        private formBuilder: FormBuilder,
        private modelService: ApprovalHistoryService,
        private approvalTeamService: ApprovalTeamService,
        private approvalConfigurationService: ApprovalConfigurationService,
        private approvalStatusService: ApprovalStatusService,
        private matDialog: MatDialog,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private appUtils: AppUtils,
        private localStorageHelper: LocalStorageHelper,
    ) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }

    ngOnInit(): void {
        this.setFormInitValue();
        this.getApprovalStatusList();
        this.getSubmitUserInfo();
        this.getApprovalConfigurationByFromTeamId();
        if (this.approvalHistory){
            this.approvalHistory.status = this.approvalStatusList.find(model => model.id === this.approvalHistory.approvalStatus);
        }

        console.log(this.approvalSubmitProperty.approvalUrl);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ API calling
    // -----------------------------------------------------------------------------------------------------
    getApprovalStatusList(): void {
        this.approvalStatusList = this.approvalStatusService.getList();
    }

    getSubmitUserInfo(): void {
        this.modelService.getSubmitUserInfo(this.approvalSubmitProperty.transactionId, this.approvalSubmitProperty.transactionTable).subscribe(res => {
            if (res.data){
                this.isSubmitUser =  this.localStorageHelper.getUserInfo().id === res.data.entryUser;
            }
        });
    }

    getApprovalConfigurationByFromTeamId(): void {
        this.approvalConfigurationService.getByOfficeId('2').subscribe(res => {
            const approvalConfigList = res.data;

            /*get next approval team*/
            this.nextApprovalTeamConfig = approvalConfigList.find(
                model => model.fromApprovalTeam.id.toString() === this.approvalUser.teamid
            );

            /*work with next team*/
            if (this.nextApprovalTeamConfig){

                /*set approval team*/
                const tempList = [];
                approvalConfigList.forEach(value => {
                    if (value.serialNo >= this.nextApprovalTeamConfig.serialNo){
                        tempList.push(value.toApprovalTeam);
                    }
                });
                this.approvalTeamDropdownList = tempList;

                /*patch value for dropdown*/
                const selectValue =  this.approvalTeamDropdownList.find(model => model.id === this.nextApprovalTeamConfig.toApprovalTeam.id);
                this.frmGroup.patchValue({
                    toApprovalTeam: selectValue,
                });

                this.selectChange();

                const selectDefaultUser = this.appUserDropdownList.find(model => model.id === this.nextApprovalTeamConfig.defaultUser.id);
                this.frmGroup.patchValue({ defaultUser: selectDefaultUser});

            }else {
                this.toApprovalTeamField.clearValidators();
                this.defaultUserField.clearValidators();

                this.toApprovalTeamField.updateValueAndValidity();
                this.defaultUserField.updateValueAndValidity();
            }

        });
    }


    onSubmit(): any {
        this.generateModel(true);
        console.log(this.model);
        this.modelService.create(this.model).subscribe(res => {
            this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
        }, error => {
            this.appUtils.onServerErrorResponse(error);
        });
    }

    onForward(): any {
        /*now generate model for forward*/
        this.model = this.approvalHistory;
        this.model.fromApprovalTeam = this.approvalHistory.toApprovalTeam;
        const appUser: AppUser = this.localStorageHelper.getUserInfo();
        this.model.fromUserId = appUser;
        this.model.fromEmpCode = appUser.employeeCode;

        this.model.approvalStatus = this.approvalStatusService.FORWARD_ID;
        this.model.toApprovalTeam = this.frmGroup.value.toApprovalTeam;
        this.model.defaultUser = this.frmGroup.value.defaultUser;
        this.model.comment = this.frmGroup.value.comment;

        console.log(this.model);
        this.modelService.create(this.model).subscribe(res => {
            this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
        }, error => {
            this.appUtils.onServerErrorResponse(error);
        });
    }

    onApproved(): any {
        /*now generate model for approved*/
        this.model = this.approvalHistory;
        this.model.fromApprovalTeam = this.approvalHistory.toApprovalTeam;
        const appUser: AppUser = this.localStorageHelper.getUserInfo();
        this.model.fromUserId = appUser;
        this.model.fromEmpCode = appUser.employeeCode;

        this.model.toApprovalTeam = null;
        this.model.defaultUser = null;
        this.model.approvalStatus = this.approvalStatusService.APPROVED_ID;
        this.model.comment = this.frmGroup.value.comment;

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

    submitDialog(): void{
        this.openDialog(ConfirmDialogConstant.MESSAGE_SUBMIT);
    }

    forwardDialog(): void{
        this.openDialog(ConfirmDialogConstant.MESSAGE_FORWARD);
    }

    approveDialog(): void{
        this.openDialog(ConfirmDialogConstant.MESSAGE_APPROVE);
    }

    backDialog(): void{
        this.onNoClick();
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '60%';
        dialogConfig.height = '65%';
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {
                    approvalHistory: this.approvalHistory,
                    approvalUser: this.approvalUser,
                    commitValue:  this.frmGroup.value.comment
                };
        const dialogRef = this.matDialog.open(ApprovalBackDialogComponent, dialogConfig);
        dialogRef.componentInstance.callBackMethod.subscribe(value => {
            this.reloadPage();
        });
    }

    resetFromData(): void {
        this.setFormInitValue();
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

    get toApprovalTeamField(): any{
        return this.frmGroup.get('toApprovalTeam');
    }

    get defaultUserField(): any{
        return this.frmGroup.get('defaultUser');
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------
    openDialog(message: string): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: message};
        const dialogRef = this.matDialog.open(SubmitConfirmationDialogComponent, dialogConfig);

        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                if (message === ConfirmDialogConstant.MESSAGE_SUBMIT){
                    this.onSubmit();
                } else if (message === ConfirmDialogConstant.MESSAGE_FORWARD){
                    this.onForward();
                }else if (message === ConfirmDialogConstant.MESSAGE_APPROVE){
                    this.onApproved();
                }
            }
            dialogRef.close(true);
        });
    }

    setFormInitValue(): void {
        this.frmGroup = this.formBuilder.group({
            toApprovalTeam: ['', Validators.required],
            defaultUser: ['', Validators.required],
            comment: ['', ''],
        });
    }

    generateModel(isCreate: boolean): void{
        // console.log(this.router.url);
        if (isCreate){this.model.id = undefined; }
        //this.model.office = this.office;
        this.model.transactionId = this.approvalSubmitProperty.transactionId;
        this.model.transactionTable = this.approvalSubmitProperty.transactionTable;
        this.model.transactionType = this.approvalSubmitProperty.transactionType;
        this.model.fromApprovalTeam = this.nextApprovalTeamConfig.fromApprovalTeam;
        const appUser: AppUser = this.localStorageHelper.getUserInfo();
        this.model.fromUserId = appUser;
        this.model.fromEmpCode = appUser.employeeCode;
        this.model.toApprovalTeam = this.frmGroup.value.toApprovalTeam;
        this.model.defaultUser = this.frmGroup.value.defaultUser;
        this.model.approvalStatus = this.approvalStatusService.SUBMIT_ID;
        this.model.link = this.approvalSubmitProperty.approvalUrl;
        this.model.comment = this.frmGroup.value.comment;
    }

    reloadPage(): void{
        this.resetFromData();
        this.onNoClick();
        this.callBackMethod.emit(true);
    }



}
