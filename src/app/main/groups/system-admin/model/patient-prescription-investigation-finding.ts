
import {PatientPrescriptionMaster} from './patient-prescription-master';
import {CommonLookupDetails} from './common-lookup-details';
import {CommonModelField} from '../../../core/models/common-model-field';

export class PatientPrescriptionInvestigationFinding extends CommonModelField {

    prescriptionMaster: PatientPrescriptionMaster;

    investigation: CommonLookupDetails;

    investigationValue: string;

    finding: string;

}
