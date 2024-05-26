import {MenuItem} from './menu-item';
import {CommonModelField} from '../../../core/models/common-model-field';

export class CommonMessageHistory extends CommonModelField{
    module: MenuItem;
    transactionId: number;
    transactionTable: string;
    transactionType: string;
    message: string;
    action: boolean;
    read: boolean;
    readDate: Date;
    close: boolean;
    link: string;
    appUserName: string;
}
