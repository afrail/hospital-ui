import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ExtraOptions, PreloadAllModules, RouterModule} from '@angular/router';
import {MarkdownModule} from 'ngx-markdown';
import {FuseModule} from '@fuse';
import {FuseConfigModule} from '@fuse/services/config';
import {FuseMockApiModule} from '@fuse/lib/mock-api';

import {mockApiServices} from 'app/mock-api';
import {LayoutModule} from 'app/layout/layout.module';
import {AppComponent} from 'app/app.component';
import {appRoutes} from 'app/app.routing';
import {SharedModule} from './main/shared/shared.module';
import {CoreModule} from './main/core/core.module';
import {appConfig} from './main/core/config/app.config';
import {HttpClient} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { DashboardModule } from './main/groups/dashboard/dashboard.module';
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {SystemAdminModule} from './main/groups/system-admin/system-admin.module';
// import { PlanningAndProgressModule } from './main/groups/planning-and-progress/planning-and-progress.module';
import {CommonGroupModule} from './main/groups/common-group/common-group.module';
import {MAT_MOMENT_DATE_FORMATS} from '@angular/material-moment-adapter';



const routerConfig: ExtraOptions = {
    scrollPositionRestoration: 'enabled',
    preloadingStrategy: PreloadAllModules,
    relativeLinkResolution: 'legacy',
    useHash: true
};


// AoT requires an exported function for factories
// tslint:disable-next-line:typedef
export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    providers: [
        {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    ],


    declarations: [
        AppComponent,

    ],
    imports: [

        // all common module
        SharedModule,

        BrowserModule,
        BrowserAnimationsModule,
        RouterModule.forRoot(appRoutes, routerConfig),

        TranslateModule.forRoot(),
        // Fuse & Fuse Mock API
        FuseModule,
        FuseConfigModule.forRoot(appConfig),
        FuseMockApiModule.forRoot(mockApiServices),

        // Core
        CoreModule,

        // bof
        DashboardModule,
        SystemAdminModule,
        // PlanningAndProgressModule,
        CommonGroupModule,

        // Layout
        LayoutModule,

        // 3rd party modules
        MarkdownModule.forRoot({}),

        // Translator
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            }
        })

    ],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
