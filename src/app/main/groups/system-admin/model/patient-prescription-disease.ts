
import {PatientPrescriptionMaster} from './patient-prescription-master';
import {CommonModelField} from '../../../core/models/common-model-field';
import {CommonLookupDetails} from './common-lookup-details';

export class PatientPrescriptionDisease extends CommonModelField {

    prescriptionMaster: PatientPrescriptionMaster;

    disease: CommonLookupDetails;

    diseaseValue: string;

    onExamination: string;

}
