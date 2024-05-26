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


      ReportUploadComponent,
      ReportMasterComponent,
      SubReportMasterComponent,
      ParameterMasterComponent,
      ReportWithParameterComponent,
      ReportRoleComponent,
      ReportRoleAssignComponent,
      ReportConfigureComponent,



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
