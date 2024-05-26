import {CommonModelField} from '../../../core/models/common-model-field';
import {UserRolePermission} from './user-role-permission';

export class UserRole extends CommonModelField {
    name: string;
    banglaName: string;
    rolePermissionList: UserRolePermission[];
}
