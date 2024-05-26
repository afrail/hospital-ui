import {CommonModelField} from '../../../core/models/common-model-field';
import {AppUser} from './app-user';
import {UserRole} from './user-role';
import {UserRoleAssignMaster} from './user-role-assign-master';

export class UserRoleAssign extends CommonModelField {
    master: UserRoleAssignMaster;
    appUser: AppUser;
    userRole: UserRole;
}
