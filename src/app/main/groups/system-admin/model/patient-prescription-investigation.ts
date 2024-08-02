
import {PatientPrescriptionMaster} from './patient-prescription-master';
import {CommonModelField} from '../../../core/models/common-model-field';
import {CommonLookupDetails} from './common-lookup-details';

export class PatientPrescriptionInvestigation extends CommonModelField {

    prescriptionMaster: PatientPrescriptionMaster;

    investigation: CommonLookupDetails;

    investigationValue: string;

    result: string;

    ref: string;

}
