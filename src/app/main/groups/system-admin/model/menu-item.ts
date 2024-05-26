import {CommonModelField} from '../../../core/models/common-model-field';
import {MenuType} from '../mock-api/menu-type.service';

export class MenuItem extends CommonModelField {
    name: string;
    banglaName: string;
    menuType: number;
    parent: MenuItem;
    uniqueModelMenuFile: string;
    serialNo: number;
    url: string;

    // extra for type
    type: MenuType;
}
