import {Component, OnDestroy, OnInit} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {MenuItem} from '../../system-admin/model/menu-item';
import {MenuTypeService} from '../../system-admin/mock-api/menu-type.service';
import {LocalStorageHelper} from '../../../core/helper/local-storage.helper';
import {AppUtils} from '../../../core/utils/app.utils';
import {StorageUtils} from '../../../core/utils/storage.utils';


@Component({
    selector: 'dashboard-home',
    templateUrl: './dashboard-home.component.html',
    styleUrls: ['./dashboard-home.component.scss']
})

export class DashboardHomeComponent implements OnInit , OnDestroy{

    menuItemGroup: MenuItem[] = new Array<MenuItem>();
    moduleDropDownList: MenuItem[] = new Array<MenuItem>();

    constructor(
        private cookieService: CookieService,
        private menuTypeService: MenuTypeService,
        private localStorageHelper: LocalStorageHelper,
        private appUtils: AppUtils,
        private storageUtils: StorageUtils,
        ) {
    }

    ngOnInit(): void {
        this.menuItemGroup = this.localStorageHelper.getGroupList(this.menuTypeService.GROUP_ID);
        this.moduleDropDownList = this.localStorageHelper.getModuleList(this.menuTypeService.MODULE_ID);
    }

    ngOnDestroy(): void{
        this.storageUtils.setSearchStorageValue(null);
    }


}
