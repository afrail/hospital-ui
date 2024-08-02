
import {PatientPrescriptionMaster} from './patient-prescription-master';
import {CommonModelField} from '../../../core/models/common-model-field';
import {CommonLookupDetails} from './common-lookup-details';

export class PatientPrescriptionChiefComplaint extends CommonModelField {

    prescriptionMaster: PatientPrescriptionMaster;

    chiefComplaint: CommonLookupDetails;

    chiefComplaintValue: string;

    duration: number;

    dwmy: number;

}
