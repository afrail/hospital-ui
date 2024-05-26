import { NgModule } from '@angular/core';
import { DashboardHomeRouting } from './dashboard-home.routing.module';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';
import {SharedModule} from '../../shared/shared.module';
import {CommonGroupModule} from '../common-group/common-group.module';

@NgModule({
  declarations: [
      DashboardHomeComponent
  ],
    imports: [
        SharedModule,
        DashboardHomeRouting,
        CommonGroupModule
    ]
})
export class DashboardModule { }
