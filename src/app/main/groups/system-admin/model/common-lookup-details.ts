import {CommonModelField} from 'app/main/core/models/common-model-field';
import {CommonLookupMaster} from './common-lookup-master';

export class CommonLookupDetails extends CommonModelField {
    name: string;
    banglaName: string;
    divisionName: string;
    master: CommonLookupMaster;
    parent: CommonLookupDetails;
    shortCode: string;
    sort_order: string;
    subModule: number;
}
