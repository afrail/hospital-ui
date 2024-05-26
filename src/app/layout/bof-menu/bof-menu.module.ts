import {NgModule} from '@angular/core';
import {FuseNavigationModule} from '@fuse/components/navigation';
import {MessagesModule} from 'app/layout/common/messages/messages.module';
import {NotificationsModule} from 'app/layout/common/notifications/notifications.module';
import {UserMenuModule} from 'app/layout/common/user-menu/user-menu.module';
import { SharedModule } from 'app/main/shared/shared.module';
import { BofMenuComponent } from './bof-menu/bof-menu.component';

@NgModule({
    declarations: [
        BofMenuComponent,
    ],
    imports     : [
        /*HttpClientModule,
        RouterModule,
        MatButtonModule,
        MatDividerModule,
        MatIconModule,
        MatMenuModule,
        MatButtonToggleModule,*/
        FuseNavigationModule,
        MessagesModule,
        NotificationsModule,
        UserMenuModule,
        SharedModule
    ],
    exports: [
        BofMenuComponent,
    ]
})
export class BofMenuModule
{
}
