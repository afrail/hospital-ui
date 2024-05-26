import {CommonModelField} from '../../../core/models/common-model-field';
import {MenuItem} from './menu-item';

export class MenuItemUrl extends CommonModelField {
    menuItem: MenuItem;
    baseURL: string;
    insert: boolean;
    edit: boolean;
    delete: boolean;
    view: boolean;

}
