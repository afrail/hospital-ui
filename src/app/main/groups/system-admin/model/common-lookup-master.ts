import {CommonModelField} from '../../../core/models/common-model-field';


export class CommonLookupMaster extends CommonModelField {
    name: string;
    banglaName: string;
    parent: CommonLookupMaster;
    subModule: number;
}
