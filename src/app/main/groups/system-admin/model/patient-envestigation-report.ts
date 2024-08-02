import {CommonModelField} from '../../../../../core/models/common-model-field';
import {PatientInfo} from './patient-info';

export class PatientEnvestigationReport extends CommonModelField {
    patient: PatientInfo;
    invDate: Date;
    remarks: string;
}
