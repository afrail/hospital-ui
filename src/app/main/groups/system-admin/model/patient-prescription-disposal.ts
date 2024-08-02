
import {PatientPrescriptionMaster} from './patient-prescription-master';
import {CommonModelField} from '../../../core/models/common-model-field';
import {CommonLookupDetails} from './common-lookup-details';

export class PatientPrescriptionDisposal extends CommonModelField {

    prescriptionMaster: PatientPrescriptionMaster;
    disposal: CommonLookupDetails;
    disposalName: string;
    disposalDuration: number;
    disposalDwmy: number;
    disposalDate: Date;
}
