import {NgModule} from '@angular/core';
import {EmptyLayoutModule} from 'app/layout/layouts/empty/empty.module';
import {SharedModule} from '../main/shared/shared.module';
import { BofLayoutComponent } from './bof-layout.component';
import { BofEmptyLayoutComponent } from './bof-empty-layout.component';
import { BofMenuModule } from './bof-menu/bof-menu.module';


const layoutModules = [
    // Empty
    EmptyLayoutModule,

    // bof
    BofMenuModule,
];

@NgModule({
    declarations: [
        BofEmptyLayoutComponent,
        BofLayoutComponent,
    ],
    imports: [
        /*MatIconModule,
        MatTooltipModule,*/
        // FuseDrawerModule,
        SharedModule,
        ...layoutModules
    ],
    exports: [
        ...layoutModules
    ]
})
export class LayoutModule {
}
