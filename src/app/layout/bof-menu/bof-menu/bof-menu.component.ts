import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Data, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FuseMediaWatcherService} from '@fuse/services/media-watcher';
import {FuseNavigationService} from '@fuse/components/navigation';
import {InitialData} from 'app/app.types';
import {TranslateService} from '@ngx-translate/core';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {MenuHelper} from '../utils/menu-helper';
import {LocalStorageHelper} from '../../../main/core/helper/local-storage.helper';
import {AppUser} from '../../../main/groups/system-admin/model/app-user';
import {AppUserEmployeeService} from '../../../main/groups/system-admin/service/app-user-employee.service';
import {AppUserEmployee} from '../../../main/groups/system-admin/model/app-user-employee';
import {ValidationMessage} from '../../../main/core/constants/validation.message';
import {environment} from '../../../../environments/environment';
import {CookieService} from 'ngx-cookie-service';

@Component({
    selector: 'bof-menu-layout',
    templateUrl: './bof-menu.component.html',
    encapsulation: ViewEncapsulation.None
})
export class BofMenuComponent implements OnInit, OnDestroy {
    userInfo: AppUser;
    data: InitialData;
    isScreenSmall: boolean;
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    navigation;
    appUserEmployee: AppUserEmployee;
    validationMsg: ValidationMessage = new ValidationMessage();

    /*dynamic menu*/
    groupId: number = 0;

    /*lang*/
    languages: any;
    selectedLanguage: any;
    langCookiesName = 'select_name';

    // dataEnglish = [];
    // dataBangla = [];

    // menuHelper: MenuHelper;

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _router: Router,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _fuseNavigationService: FuseNavigationService,
        private appUserEmployeeService: AppUserEmployeeService,
        private _translateService: TranslateService,
        private _menuHelper: MenuHelper,
        private localStorageHelper: LocalStorageHelper,
        private cookieService: CookieService
    ) {
        const cookiesLangValue = this.cookieService.get(this.langCookiesName);
        if (!cookiesLangValue){
            // this.cookieService.set(this.langCookiesName, 'en', null, '/', environment.domain);
            this.cookieService.set(this.langCookiesName, 'en');
        }
        // console.log('lang name ' + );
        this.selectedLanguage = this.cookieService.get(this.langCookiesName);
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for current year
     */
    get currentYear(): number
    {
        return new Date().getFullYear();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------
    /**
     * On init
     */
    ngOnInit(): void {
        /*Dynamic menu start*/
        /*get router data*/
        this.groupId = Number(this._activatedRoute.snapshot.paramMap.get('id'));
        this._menuHelper.init(this.groupId);

        /*Nav Initial Language*/
        this.navLanguageSwitcher(this.selectedLanguage);

        /*Dynamic menu end*/



        // Subscribe to the resolved route mock-api
        this._activatedRoute.data.subscribe((data: Data) => {
            this.data = data.initialData;
        });

        this.userInfo = this.localStorageHelper.getUserInfo();
        this.getByAppUserId();

        // Subscribe to media changes
        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({matchingAliases}) => {

                // Check if the screen is small
                this.isScreenSmall = !matchingAliases.includes('md');
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    getByAppUserId(): void {
        this.appUserEmployeeService.getByAppUserId(this.userInfo.id).subscribe(res => {
            this.appUserEmployee = res.data;
        });
    }

    /**
     * Toggle navigation
     *
     * @param name
     */
    toggleNavigation(name: string): void
    {
        // Get the navigation
        const navigation = this._fuseNavigationService.getComponent(name);

        if ( navigation )
        {
            // Toggle the opened status
            navigation.toggle();
        }
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void {

        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang);

        // set lang to cookies
        // this.cookieService.set(this.langCookiesName, lang, null, '/', environment.domain);
        this.cookieService.set(this.langCookiesName, lang);

        // Nav Language Change
        this.navLanguageSwitcher(this.selectedLanguage);
    }

    private navLanguageSwitcher(selectedLanguage: string): void {
        if (selectedLanguage === 'en') {
            this.navigation = this._menuHelper.dataEnglish;
            // this.navigation = this.groupId === 0 ? lngEnglish.data.NAV :  this._menuHelper.dataEnglish;
        } else {
            this.navigation = this._menuHelper.dataBangla;
            // this.navigation = this.groupId === 0 ? lngBangla.data.NAV : this._menuHelper.dataBangla;
        }
    }

}
