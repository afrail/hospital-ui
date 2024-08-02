import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { finalize } from 'rxjs/operators';
import { FuseAnimations } from '@fuse/animations';
import { FuseValidators } from '@fuse/validators';
import { FuseAlertType } from '@fuse/components/alert';
import {AuthService} from '../services/auth.service';
import {Router} from '@angular/router';
import {PasswordPolicy} from '../../system-admin/model/password-policy';
import {CommonValidator} from '../../../core/validator/common.validator';
import {environment} from '../../../../../environments/environment';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
    selector     : 'auth-reset-password',
    templateUrl  : './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : FuseAnimations
})
export class AuthResetPasswordComponent implements OnInit
{
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;

    alert: { type: FuseAlertType, message: string } = {
        type   : 'success',
        message: ''
    };
    resetPasswordForm: FormGroup;
    showAlert: boolean = false;

    passwordHistory: any;
    isExpire: boolean;
    hideLogin: boolean;

    private COLOR_ACCEPT = 'green';
    private COLOR_REJECT = 'red';
    policyColor: any;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _snackBar: MatSnackBar,
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {
        this.passwordHistory = history.state.passwordHistory;
        console.log(this.passwordHistory);
        this.isExpire = history.state.isExpire;
        this.hideLogin = history.state.hideLogin;
        if (!this.passwordHistory){
            this._router.navigateByUrl( 'sign-in' );
        }

        this.resetPasswordForm = this._formBuilder.group({
                oldPassword       : ['', Validators.required],
                password       : ['', Validators.required],
                passwordConfirm: ['', Validators.required]
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

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    resetPassword(): void {

        /*Return if the form is invalid*/
        if ( this.resetPasswordForm.invalid ) {
            return;
        }

        /*Return if the form is invalid*/
        if ( !this.checkPassword(this.resetPasswordForm.get('password').value)) {
            return;
        }
        console.log(this.passwordHistory.password);
        console.log(this.resetPasswordForm.get('oldPassword').value);
        /*check old password*/
        if ( this.resetPasswordForm.get('oldPassword').value !==  this.passwordHistory.password) {
            this.showAlert = true;
            // Set the alert
            this.alert = {
                type   : 'error',
                message: 'old password not match !!'
            };
            return;
        }

        // Disable the form
        this.resetPasswordForm.disable();

        // Hide the alert
        this.showAlert = false;

        // generate value
        this.passwordHistory.password = this.resetPasswordForm.get('password').value;

        // Send the request to the server
        this._authService.resetPassword(this.passwordHistory)
            .pipe(
                finalize(() => {

                    // Re-enable the form
                    this.resetPasswordForm.enable();

                    // Reset the form
                    this.resetPasswordNgForm.resetForm();

                    // Show the alert
                    this.showAlert = true;
                })
            )
            .subscribe(
                (res) => {

                    if (res.status){

                        /*Set the redirect url.*/
                        const redirectURL =  '/signed-in-redirect';

                        /*Navigate to the redirect url*/
                        this._router.navigateByUrl( redirectURL);
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
                    console.log(error);
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
        if (passwordValue.length < 5 ){
            res = false;
            this.policyColor.minLength = this.COLOR_REJECT;
        }else {
            // res = true;
            this.policyColor.minLength = this.COLOR_ACCEPT;
        }

/*        /!*check alphanumeric*!/
        if (this.passwordPolicy.alphanumeric){
            if (!CommonValidator.isContainsAlpha(passwordValue) || !CommonValidator.isContainsNumeric(passwordValue)){
                res = false;
                this.policyColor.alphanumeric = this.COLOR_REJECT;
            }else {
                // res = true;
                this.policyColor.alphanumeric = this.COLOR_ACCEPT;
            }
        }

        /!*check sequential*!/
        if (this.passwordPolicy.sequential){
            if (!CommonValidator.isContainsSequential(passwordValue)){
                res = false;
                this.policyColor.sequential = this.COLOR_REJECT;
            }else {
                // res = true;
                this.policyColor.sequential = this.COLOR_ACCEPT;
            }
        }

        /!*check specialChar*!/
        if (this.passwordPolicy.specialChar){
            if (!CommonValidator.isContainsAnySpecialChar(passwordValue)){
                res = false;
                this.policyColor.specialChar = this.COLOR_REJECT;
            }else {
                // res = true;
                this.policyColor.specialChar = this.COLOR_ACCEPT;
            }
        }

        /!*check upperLower*!/
        if (this.passwordPolicy.upperLower){
            if (!CommonValidator.isContainsUpper(passwordValue) || !CommonValidator.isContainsLower(passwordValue)){
                res = false;
                this.policyColor.upperLower = this.COLOR_REJECT;
            }else {
                // res = true;
                this.policyColor.upperLower = this.COLOR_ACCEPT;
            }
        }

        /!*check matchUsername*!/
        if (this.passwordPolicy.matchUsername){
            if (passwordValue === this.passwordHistory.appUser.username){
                res = false;
                this.policyColor.matchUsername = this.COLOR_REJECT;
            }else {
                // res = true;
                this.policyColor.matchUsername = this.COLOR_ACCEPT;
            }
        }*/

        return res;
    }
}

