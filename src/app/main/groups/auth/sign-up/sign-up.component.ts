import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {FuseAlertType} from '@fuse/components/alert';
import {AuthService} from '../services/auth.service';
import { FuseAnimations } from '../../../../../@fuse/animations';
import {MatSnackBar} from '@angular/material/snack-bar';
import {CookieService} from 'ngx-cookie-service';
import {PasswordPolicy} from '../../system-admin/model/password-policy';
@Component({
    selector: 'auth-sign-up',
    templateUrl: './sign-up.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: FuseAnimations
})
export class AuthSignUpComponent implements OnInit {
    @ViewChild('signUpNgForm') signUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: ''
    };
    signUpForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _snackBar: MatSnackBar,
        private _router: Router,
        private cookieService: CookieService
    ) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        this.signUpForm = this._formBuilder.group({
                name: ['', Validators.required],
                email: ['', [Validators.required, Validators.email]],
                password: ['', Validators.required],
                confirmPassword: ['', Validators.required],
                hospital: ['', Validators.required],
                agreements: ['', Validators.requiredTrue]
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    signUp(): void {
        // Do nothing if the form is invalid
        if (this.signUpForm.invalid) {
            return;
        }

        // Disable the form
        this.signUpForm.disable();

        // Hide the alert
        this.showAlert = false;

        if (this.signUpForm.value.password !== this.signUpForm.value.confirmPassword){
            /*show the alert*/
            this.alert = {
                type   : 'error',
                message: 'Password and confirm password should be same'
            };
            this.showAlert = true;
            this.signUpForm.enable();
        }

        // Sign up
        this._authService.signUp(this.signUpForm.value)
            .subscribe(
                (response) => {
                    console.log(response);
                    this.signUpForm.enable();
                    if (response.status){
                        this._authService.login(this.signUpForm.value.email, this.signUpForm.value.password).subscribe(
                            (res) => {
                                if (res.status){
                                    /*store token*/
                                    // console.log(res.data.userRoles);
                                    // this.cookieService.set('access_token', res.data.token, null, '/', environment.domain);
                                    this.cookieService.set('access_token', res.data.token);
                                    localStorage.setItem('userRoles', JSON.stringify(res.data.userRoles));
                                    localStorage.setItem('approvalUser', JSON.stringify(res.data.approvalUser));

                                    // console.log(res.data.approvalUser);
                                    const passwordHistory = res.data.passwordHistory;
                                    const passwordPolicy = res.data.passwordPolicy;

                                    localStorage.setItem('passwordHistory', JSON.stringify(passwordHistory));
                                    localStorage.setItem('passwordPolicy', JSON.stringify(passwordPolicy));

                                    // console.log(passwordHistory);
                                    // entryUser
                                    // appUser.id

                                    // const passwordDate: Date = passwordHistory.entryDate;

                                    // console.log(passwordDate);

                                    const isExpire = this.isPasswordExpire(passwordHistory.entryDate ? passwordHistory.entryDate : new Date(), passwordPolicy);

                                    console.log(isExpire);

                                    // return;

                                    /*Set the redirect url.*/
                                    const redirectURL = (passwordHistory && passwordHistory.entryUser !== passwordHistory.appUser.id) || isExpire ?
                                        '/reset-password' :
                                        this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                                    /*Navigate to the redirect url*/
                                    this._router.navigateByUrl(
                                        redirectURL,
                                        {
                                            state: {passwordHistory: passwordHistory, passwordPolicy: passwordPolicy, isExpire: isExpire}
                                        }
                                    );
                                }else {
                                    /*show the alert*/
                                    this.alert = {
                                        type   : 'error',
                                        message: res.message
                                    };
                                    this.showAlert = true;
                                }

                            }, (error) => {
                                console.log(error);
                                this.openSnackBar('Invalid Login', 'Ok');
                            }
                        );
                    }
                },
                (response) => {

                    // Re-enable the form
                    this.signUpForm.enable();

                    // Reset the form
                    this.signUpNgForm.resetForm();

                    // Set the alert
                    this.alert = {
                        type: 'error',
                        message: 'Something went wrong, please try again.'
                    };

                    // Show the alert
                    this.showAlert = true;
                }
            );


    }

    openSnackBar(message: string, action: string): void {
        this._snackBar.open(message, action, {
            duration: 3000,
        });
    }

    isPasswordExpire(dateDate, passwordPolicy: PasswordPolicy): boolean{
        const date = new Date(dateDate);
        const currentDate = new Date();

        const month = Math.floor((currentDate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24 / 30);

        const res = month >= passwordPolicy.passwordAge;

        // console.log(month);
        // console.log(passwordPolicy.passwordAge);
        console.log(res);
        // console.log(month);
        return res;
        // return days;
    }
}
