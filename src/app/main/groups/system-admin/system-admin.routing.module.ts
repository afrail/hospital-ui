import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InitialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/main/core/auth/guards/auth.guard';
import {SystemAdminHomeComponent} from './system-admin-home/system-admin-home.component';
import {MenuItemComponent} from './features/menu-item/menu-item.component';
import {MenuItemUrlComponent} from './features/menu-item-url/menu-item-url.component';
import {UserRoleAddComponent} from './features/user-role/user-role-add/user-role-add.component';
import {AppUserComponent} from './features/app-user/app-user.component';
import {PasswordPolicyComponent} from './features/password-policy/password-policy.component';
import {AppUserEmployeeAddComponent} from './features/app-user-employee/app-user-employee-add/app-user-employee-add.component';
import {UserRoleAssignAddComponent} from './features/user-role-assign/user-role-add/user-role-assign-add.component';
import {ApprovalTeamComponent} from './features/approval-team/approval-team.component';
import { ReportMasterComponent } from './features/report-master/report-master.component';
import {ApprovalConfigurationComponent} from './features/approval-configuration/approval-configuration.component';
import {BofLayoutComponent} from '../../../layout/bof-layout.component';
import { ParameterMasterComponent } from './features/parameter-master/parameter-master.component';
import { ReportWithParameterComponent } from './features/report-with-parameter/report-with-parameter.component';
import { ReportConfigureComponent } from './features/report-configure/report-configure.component';
import { SubReportMasterComponent } from './features/sub-report-master/sub-report-master.component';
import { ReportUploadComponent } from './features/report-upload/report-upload.component';
import { ReportRoleComponent } from './features/report-role/report-role.component';
import { ReportRoleAssignComponent } from './features/report-role-assign/report-role-assign.component';
import {DoctorInformationComponent} from './features/doctor-information/doctor-information.component';
import {TokenRegister} from './model/token-register';
import {TokenRegisterAddComponent} from './features/token-register-add/token-register-add.component';
import {TokenRegisterListComponent} from './features/token-register-list/token-register-list.component';
import {CommonLookupMaster} from './model/common-lookup-master';
import {CommonLookupDetailsComponent} from './features/common-lookup-details/common-lookup-details.component';
import {CommonLookupMasterComponent} from './features/common-lookup-master/common-lookup-master.component';
import {
    PatientPrescriptionListComponent
} from './features/patient-prescription/patient-prescription-list/patient-prescription-list.component';
import {
    PatientPrescriptionAddComponent
} from './features/patient-prescription/patient-prescription-add/patient-prescription-add.component';
import {MedicineMasterComponent} from './features/medicine-master/medicine-master.component';

const routes: Routes = [
    {
        path: 'system-admin/:id',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: BofLayoutComponent,
        resolve: {
            initialData: InitialDataResolver,
        },
        children: [
            {path: '', component: SystemAdminHomeComponent},
            {path: 'menu-item', component: MenuItemComponent},
            {path: 'menu-item-url', component: MenuItemUrlComponent},
            {path: 'user-role', component: UserRoleAddComponent},
            {path: 'password-policy', component: PasswordPolicyComponent},
            {path: 'app-user', component: AppUserComponent},
            {path: 'app-user-employee', component: AppUserEmployeeAddComponent},
            {path: 'user-role-assign', component: UserRoleAssignAddComponent},
            {path: 'approval-team', component: ApprovalTeamComponent},
            {path: 'approval-configuration', component: ApprovalConfigurationComponent},


            {path: 'report-upload', component: ReportUploadComponent},
            {path: 'report-master', component: ReportMasterComponent},
            {path: 'sub-report-master', component: SubReportMasterComponent},
            {path: 'parameter-master', component: ParameterMasterComponent},
            {path: 'report-with-parameter', component: ReportWithParameterComponent},
            {path: 'report-role', component: ReportRoleComponent},
            {path: 'report-role-assign', component: ReportRoleAssignComponent},
            {path: 'report-configure', component: ReportConfigureComponent},
            {path: 'common-setup-master', component: CommonLookupMasterComponent},
            {path: 'common-setup-details', component: CommonLookupDetailsComponent},


            {path: 'doctor-information', component: DoctorInformationComponent},
            {path: 'token-register', component: TokenRegisterListComponent},
            {path: 'token-register-add', component: TokenRegisterAddComponent},
            {path: 'patient-prescription', component: PatientPrescriptionListComponent},
            {path: 'patient-prescription-add', component: PatientPrescriptionAddComponent},
            {path: 'medicine-master', component: MedicineMasterComponent},




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
export class SystemAdminRoutingModule {
}
