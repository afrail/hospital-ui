import {CommonModelField} from '../../../core/models/common-model-field';
import {MenuItemUrl} from './menu-item-url';
import {UserRole} from './user-role';
import {MenuItem} from './menu-item';

export class UserRolePermission extends CommonModelField {
    userRole: UserRole;
    menuItemUrl: MenuItemUrl;
    menuItemReport: MenuItem;
    insert: boolean;
    edit: boolean;
    delete: boolean;
    view: boolean;
}
