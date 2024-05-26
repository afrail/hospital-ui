import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {FuseAnimations} from '@fuse/animations';
import {FuseAlertType} from '@fuse/components/alert';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AuthService} from '../services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import {environment} from '../../../../../environments/environment';
import {PasswordPolicy} from '../../system-admin/model/password-policy';
import {switchMap} from 'rxjs/operators';
import {of} from 'rxjs';


@Component({
    selector     : 'auth-sign-in',
    templateUrl  : './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : FuseAnimations
})
export class AuthSignInComponent implements OnInit {

    alert: { type: FuseAlertType, message: string } = {
        type   : 'success',
        message: ''
    };

    signInForm: FormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: FormBuilder,
        private _router: Router,
        private _snackBar: MatSnackBar,
        private cookieService: CookieService
    ) { }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void  {

        this.checkAlreadyLogin();

        this.signInForm = this._formBuilder.group({
            email     : ['', [Validators.required]],
            password  : ['', Validators.required]
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    checkAlreadyLogin(): void{
        const token = this.cookieService.get('access_token');
         console.log('token : ' + token);
        if (token){
            this._router.navigate(['dashboard']);
        }
    }

    signIn(): void {
        if ( this.signInForm.invalid ) {
            return;
        }

        // Disable the form
        this.signInForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this._authService.login(this.signInForm.value.email, this.signInForm.value.password)
            .subscribe(
                (res) => {
                    this.signInForm.enable();
                    if (res.status){
                        /*store token*/
                        this.cookieService.set('access_token', res.data.token);
                        localStorage.setItem('userRoles', JSON.stringify(res.data.userRoles));
                        localStorage.setItem('approvalUser', JSON.stringify(res.data.approvalUser));


                        // return;

                        /*Set the redirect url.*/
                        const redirectURL =
                            this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

                        /*Navigate to the redirect url*/
                        this._router.navigateByUrl(
                            redirectURL
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
                    this.signInForm.enable();
                    this.openSnackBar('Invalid Login', 'Ok');
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
