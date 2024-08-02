
import {PatientPrescriptionMaster} from './patient-prescription-master';
import {CommonModelField} from '../../../core/models/common-model-field';
import {CommonLookupDetails} from './common-lookup-details';

export class PatientPrescriptionAdvice extends CommonModelField {

    prescriptionMaster: PatientPrescriptionMaster;

    advice: CommonLookupDetails;

    adviceValue: string;
}
