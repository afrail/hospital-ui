import {NgModule} from '@angular/core';
import {SharedModule} from '../../shared/shared.module';
import {CommonGroupRouting} from './common-group.routing.module';
import { CommonGroupHomeComponent } from './common-group-home/common-group-home.component';
import {ManagmentDashboardComponent} from './modules/features/managment-dashboard/managment-dashboard.component';

@NgModule({
    declarations: [
        CommonGroupHomeComponent,
        ManagmentDashboardComponent,

    ],
    exports: [
        ManagmentDashboardComponent
    ],
    imports: [
        SharedModule,
        CommonGroupRouting
    ]
})
export class CommonGroupModule {
}
