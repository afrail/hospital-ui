import {UserRoleAssign} from '../../../../model/user-role-assign';
import {UserRoleAssignMaster} from '../../../../model/user-role-assign-master';

export class UserRoleAssignDto {
    master: UserRoleAssignMaster;
    detailsList: UserRoleAssign[];
}
