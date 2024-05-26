import {ApprovalTeamDetails} from '../../groups/system-admin/model/approval-team-details';
import {MenuItem} from '../../groups/system-admin/model/menu-item';
import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {AppUser} from '../../groups/system-admin/model/app-user';
import {AuthUtils} from '../auth/auth.utils';
import {CookieService} from 'ngx-cookie-service';
import {ApprovalUser} from '../../groups/system-admin/model/approval-user';

@Injectable({
    providedIn: 'root'
})
export class LocalStorageHelper {

    constructor(private cookieService: CookieService) {
    }

    getUserRolesList(): any{
        return JSON.parse(localStorage.getItem('userRoles'));
    }

    getApprovalUserList(): ApprovalUser []{
        return JSON.parse(localStorage.getItem('approvalUser'));
    }

    getPasswordHistory(): any{
        return JSON.parse(localStorage.getItem('passwordHistory'));
    }

    getPasswordPolicy(): any{
        return JSON.parse(localStorage.getItem('passwordPolicy'));
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Get Group List
    // -----------------------------------------------------------------------------------------------------

    getGroupList(groupId): MenuItem[]{
        const menuItemGroup: MenuItem[] = new Array<MenuItem>();
        const  data = this.getUserRolesList();
        data.forEach(obj => {
            obj.userRole.rolePermissionList.forEach(role => {
                const group = role.menuItemUrl.menuItem.parent.parent.parent ?  role.menuItemUrl.menuItem.parent.parent.parent : role.menuItemUrl.menuItem.parent.parent;
                let isExist = false;
                menuItemGroup.forEach(value => { if (value.id === group.id){ isExist = true; } });
                if (!isExist && group.menuType === groupId){ menuItemGroup.push(group); }
            });
        });

        /*now sort list*/
        menuItemGroup.sort((a, b) => (a.serialNo > b.serialNo) ? 1 : ((b.serialNo > a.serialNo) ? -1 : 0));
        return menuItemGroup;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Get Module List
    // -----------------------------------------------------------------------------------------------------

    getModuleList(moduleId): MenuItem[]{
        const moduleList: MenuItem[] = new Array<MenuItem>();
        const  data = this.getUserRolesList();
        data.forEach(obj => {
            obj.userRole.rolePermissionList.forEach(role => {
                const module = role.menuItemUrl.menuItem.parent.menuType === moduleId ? role.menuItemUrl.menuItem.parent : role.menuItemUrl.menuItem.parent.parent;
                // console.log(module);
                let isExist = false;
                moduleList.forEach(value => { if (value.id === module.id){ isExist = true; } });
                if (!isExist && module.menuType === moduleId
                   && module.id !== 10 &&  module.id !== 93 &&  module.id !== 11
                ){
                    moduleList.push(module); }
            });
        });
        return moduleList;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Get User Info From Token
    // -----------------------------------------------------------------------------------------------------

    getUserInfo(): AppUser{
        const decodedToken = AuthUtils._decodeToken(this.cookieService.get('access_token').toString());
        return decodedToken.userInfo;
    }

}
