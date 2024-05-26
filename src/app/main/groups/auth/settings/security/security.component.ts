import {ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {FuseAlertType} from '../../../../../../@fuse/components/alert';
import {PasswordPolicy} from '../../../system-admin/model/password-policy';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {FuseValidators} from '../../../../../../@fuse/validators';
import {CommonValidator} from '../../../../core/validator/common.validator';
import {LocalStorageHelper} from '../../../../core/helper/local-storage.helper';
import {finalize} from 'rxjs/operators';
import {AppUtils} from '../../../../core/utils/app.utils';
import {AppUserService} from '../../../system-admin/service/app-user.service';
import {PasswordChangeDto} from './password-change-dto';

@Component({
    selector       : 'settings-security',
    templateUrl    : './security.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsSecurityComponent implements OnInit
{
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;
    securityForm: FormGroup;


    alert: { type: FuseAlertType, message: string } = {
        type   : 'success',
        message: ''
    };
    showAlert: boolean = false;

    passwordHistory: any;
    passwordPolicy: PasswordPolicy;
    isExpire: boolean;
    hideLogin: boolean;


    private COLOR_ACCEPT = 'green';
    private COLOR_REJECT = 'red';
    policyColor: any;

    model: PasswordChangeDto = new PasswordChangeDto();
    /**
     * Constructor
     */
    constructor(
        private modelService: AppUserService,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _snackBar: MatSnackBar,
        private localStorageHelper: LocalStorageHelper,
        private appUtils: AppUtils,
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {

        this.passwordHistory = this.localStorageHelper.getPasswordHistory();
        this.passwordPolicy = this.localStorageHelper.getPasswordPolicy();
        this.isExpire = history.state.isExpire;
        this.hideLogin = history.state.hideLogin;
        console.log(this.passwordPolicy);
        console.log(this.passwordHistory);
        if (!this.passwordHistory){
            console.log('no history');
        }
        if (!this.passwordPolicy){
            console.log('no policy');
        }
        // if (!this.passwordHistory){
        //     this._router.navigateByUrl( 'sign-in' );
        // }

        this.securityForm = this._formBuilder.group({
                currentPassword       : ['', Validators.required],
                password       : ['', Validators.required],
                passwordConfirm: ['', Validators.required],
                twoStep          : [true]
            },
            {
                validators: FuseValidators.mustMatch('password', 'passwordConfirm')
            }
        );

        this.policyColor = {
            minLength: this.COLOR_REJECT,
            alphanumeric: this.COLOR_REJECT,
            sequential: this.COLOR_REJECT,
            specialChar: this.COLOR_REJECT,
            upperLower: this.COLOR_REJECT,
            matchUsername: this.COLOR_REJECT,
        };
    }

    generateModel(): any {
        console.log('ggyughb');
        this.model.password = this.securityForm.value.password;
        this.model.confirmPassword = this.securityForm.value.passwordConfirm;

    }


    resetPassword(): void {

        console.log('hit');
        /*Return if the form is invalid*/
        // if ( this.securityForm.invalid ) {
        //     return;
        // }

        /*Return if the form is invalid*/
        if ( !this.checkPassword(this.securityForm.get('password').value)) {
            return;
        }

        /*check old password*/
        if ( this.securityForm.get('currentPassword').value !==  this.passwordHistory.password) {
            this.showAlert = true;
            // Set the alert
            this.alert = {
                type   : 'error',
                message: 'old password not match !!'
            };
            return;
        }

        // Disable the form
        this.securityForm.disable();

        // Hide the alert
        this.showAlert = false;

        // generate value
        this.passwordHistory.password = this.securityForm.get('password').value;

        this.generateModel();

        console.log(this.model);
        // Send the request to the server
        this.modelService.changePassword(this.model)
            .subscribe(
                (res) => {

                    if (res.status){
                        this.appUtils.onServerSuccessResponse(res);

                    }else {
                        /*show the alert*/
                        this.alert = {
                            type   : 'error',
                            message: res.message
                        };
                        this.showAlert = true;
                    }

                },
                (error) => {
                    this.appUtils.onServerErrorResponse(error);
                    this.openSnackBar('Failed to reset password', 'Ok');
                }
            );
    }



    openSnackBar(message: string, action: string): void {
        this._snackBar.open(message, action, {
            duration: 3000,
        });
    }

    checkPassword(passwordValue: string): boolean {
        let res = true;

        /*check length*/
        if (passwordValue.length < this.passwordPolicy.minLength ){
            res = false;
            this.policyColor.minLength = this.COLOR_REJECT;
        }else {
            // res = true;
            this.policyColor.minLength = this.COLOR_ACCEPT;
        }

        /*check alphanumeric*/
        if (this.passwordPolicy.alphanumeric){
            if (!CommonValidator.isContainsAlpha(passwordValue) || !CommonValidator.isContainsNumeric(passwordValue)){
                res = false;
                this.policyColor.alphanumeric = this.COLOR_REJECT;
            }else {
                // res = true;
                this.policyColor.alphanumeric = this.COLOR_ACCEPT;
            }
        }

        /*check sequential*/
        if (this.passwordPolicy.sequential){
            if (!CommonValidator.isContainsSequential(passwordValue)){
                res = false;
                this.policyColor.sequential = this.COLOR_REJECT;
            }else {
                // res = true;
                this.policyColor.sequential = this.COLOR_ACCEPT;
            }
        }

        /*check specialChar*/
        if (this.passwordPolicy.specialChar){
            if (!CommonValidator.isContainsAnySpecialChar(passwordValue)){
                res = false;
                this.policyColor.specialChar = this.COLOR_REJECT;
            }else {
                // res = true;
                this.policyColor.specialChar = this.COLOR_ACCEPT;
            }
        }

        /*check upperLower*/
        if (this.passwordPolicy.upperLower){
            if (!CommonValidator.isContainsUpper(passwordValue) || !CommonValidator.isContainsLower(passwordValue)){
                res = false;
                this.policyColor.upperLower = this.COLOR_REJECT;
            }else {
                // res = true;
                this.policyColor.upperLower = this.COLOR_ACCEPT;
            }
        }

        /*check matchUsername*/
        if (this.passwordPolicy.matchUsername){
            if (passwordValue === this.passwordHistory.appUser.username){
                res = false;
                this.policyColor.matchUsername = this.COLOR_REJECT;
            }else {
                // res = true;
                this.policyColor.matchUsername = this.COLOR_ACCEPT;
            }
        }

        return res;
    }
}
