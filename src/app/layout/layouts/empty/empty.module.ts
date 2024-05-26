import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {EmptyLayoutComponent} from 'app/layout/layouts/empty/empty.component';
import {SharedModule} from '../../../main/shared/shared.module';

@NgModule({
    declarations: [
        EmptyLayoutComponent
    ],
    imports     : [
        RouterModule,
        SharedModule
    ],
    exports     : [
        EmptyLayoutComponent
    ]
})
export class EmptyLayoutModule
{
}
