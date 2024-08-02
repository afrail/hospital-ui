import {PatientPrescriptionMaster} from './patient-prescription-master';
import {CommonModelField} from '../../../core/models/common-model-field';
import {CommonLookupDetails} from './common-lookup-details';



export class PatientPrescriptionReferredDoctor extends CommonModelField{

    prescriptionMaster: PatientPrescriptionMaster;
    referredDoctor: CommonLookupDetails;
    refDocValue: string;
}
