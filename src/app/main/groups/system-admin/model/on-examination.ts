import {PatientPrescriptionMaster} from './patient-prescription-master';
import {CommonModelField} from '../../../core/models/common-model-field';

export class OnExamination extends CommonModelField{

     prescriptionMaster: PatientPrescriptionMaster;

     onExamination: string;
}
