import {Route} from '@angular/router';
import { BofEmptyLayoutComponent } from './layout/bof-empty-layout.component';


// @formatter:off
// tslint:disable:max-line-length
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'sign-in'},
    // Redirect signed in user to the '/example'
    //
    // After the user signs in, the sign in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'dashboard'},


    // Auth routes for guests
    {
        path: '',
        component: BofEmptyLayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-in', loadChildren: () => import('app/main/groups/auth/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
            {path: 'sign-up', loadChildren: () => import('app/main/groups/auth/sign-up/sign-up.module').then(m => m.AuthSignUpModule)},
            {path: 'sign-out', loadChildren: () => import('app/main/groups/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
            {path: 'reset-password', loadChildren: () => import('app/main/groups/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
            
        ]
    },


];
