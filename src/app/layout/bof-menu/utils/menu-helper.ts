import {LocalStorageHelper} from '../../../main/core/helper/local-storage.helper';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MenuHelper {

    dataEnglish = [];
    dataBangla = [];

    constructor(private localStorageHelper: LocalStorageHelper) {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Dynamic menu
    // -----------------------------------------------------------------------------------------------------

    public init(groupId): void{
        this.dataEnglish = [];
        this.dataBangla = [];

        /*menu list*/
        const  roleList = this.localStorageHelper.getUserRolesList();

        /*for dashboard*/
        if (groupId === 0){
            const groupList = [];
            for (const obj of roleList) {
                for (const role of obj.userRole.rolePermissionList) {
                    const maxParent = role.menuItemUrl.menuItem.parent.parent.parent;
                    const group = maxParent ? maxParent : role.menuItemUrl.menuItem.parent.parent;
                    const grp = groupList.find(model => model.id === group.id);
                    if (!grp){
                        groupList.push(group);
                    }
                }
            }

            /*now sort list*/
            groupList.sort((a, b) => (a.serialNo > b.serialNo) ? 1 : ((b.serialNo > a.serialNo) ? -1 : 0));

            groupList.forEach(value => {
                this.dataEnglish.push({
                    id   : 'navigation-features.level.0',
                    title: value.name,
                    type : 'basic',
                    icon : 'heroicons_outline:chart-pie',
                    link : value.url + '/' + value.id
                });

                this.dataBangla.push({
                    id   : 'navigation-features.level.0',
                    title: value.banglaName,
                    type : 'basic',
                    icon : 'heroicons_outline:chart-pie',
                    link : value.url + '/' + value.id
                });
            });
            return;
        }

        /*for other then dashboard*/
        /*common item*/
        this.dataEnglish.push({
            id   : 'navigation-features.level.0',
            title: 'DashBoard',
            type : 'basic',
            icon : 'heroicons_outline:chart-pie',
            link : '/dashboard'
        });

        this.dataBangla.push({
            id   : 'navigation-features.level.0',
            title: 'ড্যাশ বোর্ড',
            type : 'basic',
            icon : 'heroicons_outline:chart-pie',
            link : '/dashboard'
        });


        /*work on lang*/
        this.generateLangList(roleList, groupId);
    }


    private generateLangList(data, groupId): void{
        let groupCheck;
        const moduleListCheck = [];

        for (const obj of data){
            for (const role of obj.userRole.rolePermissionList){
                const maxParent = role.menuItemUrl.menuItem.parent.parent.parent;
                const group = maxParent ? maxParent : role.menuItemUrl.menuItem.parent.parent;
                if (group.id === groupId){
                    /*working for group*/
                    if (!groupCheck){ groupCheck =  group; this.setGroup(groupCheck); }

                    /*working for module*/
                    const module = maxParent ? role.menuItemUrl.menuItem.parent.parent :  role.menuItemUrl.menuItem.parent;
                    let isExist = false;
                    for (const v of moduleListCheck){ if (v.id === module.id){ isExist = true; } }
                    if (!isExist){
                        module.maxParent = maxParent;
                        moduleListCheck.push(module);
                    }
                }
            }
        }

        /*now sort list*/
        moduleListCheck.sort((a, b) => (a.serialNo > b.serialNo) ? 1 : ((b.serialNo > a.serialNo) ? -1 : 0));

        /*now generate lang list*/
        moduleListCheck.forEach(module => {
            this.setModule(data, groupCheck, module,  module.maxParent);
        });

    }

    /*group set part*/
    private  setGroup(group): void{
        this.dataEnglish.push({
            id   : 'navigation-features.level.0',
            title: group.name,
            type : 'basic',
            icon : 'heroicons_outline:chart-pie',
            link : group.url + '/' + group.id
        });

        this.dataBangla.push({
            id   : 'navigation-features.level.0',
            title: group.banglaName,
            type : 'basic',
            icon : 'heroicons_outline:chart-pie',
            link : group.url + '/' + group.id
        });
    }

    /*module set part*/
    private  setModule(data, group, module, maxParent): void{
        this.dataEnglish.push({
            id   : 'navigation-features.level.0',
            title: module.name,
            type : 'collapsable',
            icon : 'heroicons_outline:check-circle',
            children : maxParent ?  this.getMenuGroup(data, module, group, false) : this.getMenu(data, module, group, false)
        });

        this.dataBangla.push({
            id   : 'navigation-features.level.0',
            title: module.banglaName,
            type : 'collapsable',
            icon : 'heroicons_outline:check-circle',
            children : maxParent ?  this.getMenuGroup(data, module, group, true) : this.getMenu(data, module, group, true)
        });
    }

    /*menuGroup set part*/
    private getMenuGroup(data, module, group, isBangal): any{
        const returnList = [];
        const menuGroupList = [];
        for (const obj of data){
            for (const role of obj.userRole.rolePermissionList){
                const menuGroup = role.menuItemUrl.menuItem.parent;
                if (menuGroup.parent.id === module.id){
                    let isExist = false;
                    for (const v of menuGroupList){ if (v.id === menuGroup.id){ isExist = true; } }
                    if (!isExist){
                        menuGroupList.push(menuGroup);
                    }
                }
            }
        }

        /*now sort list*/
        menuGroupList.sort((a, b) => (a.serialNo > b.serialNo) ? 1 : ((b.serialNo > a.serialNo) ? -1 : 0));

        /*now generate lang list*/
        menuGroupList.forEach(menuGroup => {
            returnList.push(
                {
                    id   : 'navigation-features.level.0',
                    title: isBangal ? menuGroup.banglaName : menuGroup.name,
                    type : 'collapsable',
                    icon : 'heroicons_outline:check-circle',
                    children : this.getMenu(data, menuGroup, group, isBangal)
                }
            );
        });

        return returnList;
    }



    private getMenu(data, module, group, isBangal): any{
        const returnList = [];
        const menuList = [];
        for (const obj of data){
            for (const role of obj.userRole.rolePermissionList){
                if (role.menuItemUrl.menuItem.parent.id === module.id){
                    let isExist = false;
                    for (const v of menuList){ if (v.id === role.menuItemUrl.id){ isExist = true; } }
                    if (!isExist){
                        menuList.push(role.menuItemUrl);
                    }
                }
            }
        }

        /*now sort list*/
        menuList.sort((a, b) => (a.menuItem.serialNo > b.menuItem.serialNo) ? 1 : ((b.menuItem.serialNo > a.menuItem.serialNo) ? -1 : 0));

        /*now generate lang list*/
        menuList.forEach(menuItemUrl => {
            returnList.push(
                {
                    id: 'navigation-features.level.0.1',
                    title: isBangal ? menuItemUrl.menuItem.banglaName : menuItemUrl.menuItem.name,
                    type: 'basic',
                    link: group.url + '/' + group.id + menuItemUrl.baseURL
                }
            );
        });
        return returnList;
    }


}
