import {NgModule} from '@angular/core';
import {SystemAdminRoutingModule} from './system-admin.routing.module';
import {SharedModule} from '../../shared/shared.module';
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
import { ParameterMasterComponent } from './features/parameter-master/parameter-master.component';
import { ReportWithParameterComponent } from './features/report-with-parameter/report-with-parameter.component';
import { ReportConfigureComponent } from './features/report-configure/report-configure.component';
import { SubReportMasterComponent } from './features/sub-report-master/sub-report-master.component';
import { ReportUploadComponent } from './features/report-upload/report-upload.component';
import { ReportRoleComponent } from './features/report-role/report-role.component';
import { ReportRoleAssignComponent } from './features/report-role-assign/report-role-assign.component';
import {TokenRegisterAddComponent} from './features/token-register-add/token-register-add.component';
import {DoctorInformationComponent} from './features/doctor-information/doctor-information.component';
import {TokenRegisterListComponent} from './features/token-register-list/token-register-list.component';
import {CommonLookupMasterComponent} from './features/common-lookup-master/common-lookup-master.component';
import {CommonLookupDetailsComponent} from './features/common-lookup-details/common-lookup-details.component';
import {MedicineMasterComponent} from './features/medicine-master/medicine-master.component';
import {
    PatientPrescriptionAddComponent
} from './features/patient-prescription/patient-prescription-add/patient-prescription-add.component';
import {
    PrescriptionHistoryDailogComponent
} from './features/patient-prescription/dialog/prescription-history-dailog/prescription-history-dailog.component';
import {
    PatientPrescriptionListComponent
} from './features/patient-prescription/patient-prescription-list/patient-prescription-list.component';
import {CustomNameFilterPipes} from './features/utils/custom-name-filter.pipes';

/*const _materialModule = [
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatStepperModule,
    MatTableModule,
    MatCheckboxModule,
    MatCardModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatDialogModule,
];*/

@NgModule({
  declarations: [
      SystemAdminHomeComponent,

      MenuItemComponent,
      MenuItemUrlComponent,
      UserRoleAddComponent,
      AppUserComponent,
      PasswordPolicyComponent,
      AppUserEmployeeAddComponent,
      UserRoleAssignAddComponent,
      ApprovalTeamComponent,
      ApprovalConfigurationComponent,
      CustomNameFilterPipes,


      ReportUploadComponent,
      ReportMasterComponent,
      SubReportMasterComponent,
      ParameterMasterComponent,
      ReportWithParameterComponent,
      ReportRoleComponent,
      ReportRoleAssignComponent,
      ReportConfigureComponent,
      CommonLookupMasterComponent,
      CommonLookupDetailsComponent,
      MedicineMasterComponent,

      // Doctor Patient
      TokenRegisterAddComponent,
      TokenRegisterListComponent,
      DoctorInformationComponent,
      PatientPrescriptionAddComponent,
      PrescriptionHistoryDailogComponent,
      PatientPrescriptionListComponent




  ],
    imports: [
        // _materialModule,


        /*MatDatepickerModule,
        MatTabsModule,
        MatChipsModule,
        MatPaginatorModule,
        MatButtonToggleModule,
        MatSortModule,
        MatTooltipModule,
        MatRadioModule,
        MatProgressSpinnerModule,*/

        /*CommonModule,
        HttpClientModule,
        TranslateModule,
        TranslateModule.forRoot(),
        FuseCardModule,
        FlexLayoutModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        DragDropModule,*/

        SharedModule,
        SystemAdminRoutingModule,


    ]
})
export class SystemAdminModule { }
