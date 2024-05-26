import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InitialDataResolver} from 'app/app.resolvers';
import {AuthGuard} from 'app/main/core/auth/guards/auth.guard';
import {BofLayoutComponent} from '../../../layout/bof-layout.component';
import {CommonGroupHomeComponent} from './common-group-home/common-group-home.component';

// import {
//     DrawingFileAccessRequestApproveListComponent
// } from '../planning-and-progress/modules/drawing/features/file-access-request/drawing-file-access-request-approve-list/drawing-file-access-request-approve-list.component';
// import {
//     BudgetDemandAnalysisApproveListComponent
// } from '../administration/modules/budget-and-cash/features/budget-demand/budget-demand-analysis-approve-list/budget-demand-analysis-approve-list.component';
import {ReportConfigureComponent} from '../system-admin/features/report-configure/report-configure.component';
// import {
//     DrawingFileAccessRequestListComponent
// } from '../planning-and-progress/modules/drawing/features/file-access-request/drawing-file-access-request-list/drawing-file-access-request-list.component';
// import {
//     DrawingFileAccessRequestAddComponent
// } from '../planning-and-progress/modules/drawing/features/file-access-request/drawing-file-access-request-add/drawing-file-access-request-add.component';
// import {DrawingBookInfoListComponent} from '../planning-and-progress/modules/drawing/features/drawing-book-info/drawing-book-info-list.component';


const routes: Routes = [
    // Admin routes
    {
        path: 'common-group/:id',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: BofLayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {path: '', component: CommonGroupHomeComponent},

            /*Approval Menu*/

            /*meeting*/

            /*report*/
            {path: 'report-configure', component: ReportConfigureComponent},

            /*gate pass*/

            /*ict*/


            // office opening and closing
            {path: 'settings', loadChildren: () => import('app/main/groups/auth/settings/settings.module').then(m => m.SettingsModule)},

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
export class CommonGroupRouting {
}
