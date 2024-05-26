import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/main/core/auth/guards/auth.guard';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import {BofLayoutComponent} from '../../../layout/bof-layout.component';
import {ReportConfigureComponent} from '../system-admin/features/report-configure/report-configure.component';

const routes: Routes = [
    {
        path: 'dashboard',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: BofLayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {path: '', component: DashboardHomeComponent},



            /*meeting*/

            /*report*/
            {path: 'report-configure', component: ReportConfigureComponent},


            /*ict*/





        ]
    }
];


@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
    providers: []
})
export class DashboardHomeRouting {
}
