import {CommonModelField} from '../../../core/models/common-model-field';
import {CommonLookupDetails} from './common-lookup-details';


export class MedicineMaster extends CommonModelField {


    medicineGroup: CommonLookupDetails;

    unitMeasurement: CommonLookupDetails;

    medicineName: string;

    barcode: string;

    /* main store */

    minimumStock: number;

    warningStock: number;

    availableStock: number;

    /* sub store */

    minimumStockSub: number;

    warningStockSub: number;

    availableStockSub: number;


    /* Emergency */
    minimumStockEmergency: number;

    warningStockEmergency: number;

    availableStockEmergency: number;

    /* dental */
    minimumStockDental: number;

    warningStockDental: number;

    availableStockDental: number;

    /*pathology*/
    availableStockPathology: number;

    /* Factory Mi*/
    availableStockFactoryMi: number;

    /*other*/
    medicineIs: boolean;

    hosType: number;

    /*extra*/
    name: string;


}
