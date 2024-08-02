import {PatientPrescriptionMaster} from './patient-prescription-master';
import {MedicineMaster} from './medicine-master';
import {CommonModelField} from '../../../core/models/common-model-field';
import {CommonLookupDetails} from './common-lookup-details';

export class PatientPrescriptionTreatment extends CommonModelField {

    serialNo: number;

    prescriptionMaster: PatientPrescriptionMaster;

    medicineMaster: MedicineMaster;

    dose: CommonLookupDetails;

    doseValue: string;

    duration: number;

    dwmy: number;

    qty: number;

    instruction: CommonLookupDetails;

    instructionValue: string;

    continueIs: boolean;

    deliveryQty: number;

}
