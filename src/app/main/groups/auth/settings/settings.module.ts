import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/main/shared/shared.module';
import { SettingsComponent } from 'app/main/groups/auth/settings/settings.component';
import { SettingsAccountComponent } from 'app/main/groups/auth/settings/account/account.component';
import { SettingsSecurityComponent } from 'app/main/groups/auth/settings/security/security.component';
import { SettingsPlanBillingComponent } from 'app/main/groups/auth/settings/plan-billing/plan-billing.component';
import { SettingsNotificationsComponent } from 'app/main/groups/auth/settings/notifications/notifications.component';
import { SettingsTeamComponent } from 'app/main/groups/auth/settings/team/team.component';
import { settingsRoutes } from 'app/main/groups/auth/settings/settings.routing';

@NgModule({
    declarations: [
        SettingsComponent,
        SettingsAccountComponent,
        SettingsSecurityComponent,
        SettingsPlanBillingComponent,
        SettingsNotificationsComponent,
        SettingsTeamComponent
    ],
    imports     : [
        RouterModule.forChild(settingsRoutes),
        MatButtonModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        FuseAlertModule,
        SharedModule
    ]
})
export class SettingsModule
{
}
