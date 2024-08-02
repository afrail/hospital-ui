import {CommonModelField} from '../../../core/models/common-model-field';
import {DoctorInformation} from './doctor-information';


export class PatientPrescriptionMaster extends CommonModelField {

    prescriptionNo: string;

    tokenRegisterId: number;

    tokenRegisterNo: string;

    patientInfo: any;

    doctorInfo: DoctorInformation;

    illness: string;

    pulse: string;

    bp: string;

    temp: string;

    rr: string;

    height: string;

    weight: string;

    ofc: string;

    spo2: string;

    onExamination: string;

    diseaseDetails: string;

    prescriptionDate: Date;

    otherAdvice: string;

    followUpVisitDuration: number;

    followUpVisitDate: Date;

    followUpComment: string;

    investigationEntryIs: boolean;

    disposalId: number;

    disposalName: string;

    disposalDuration: number;

    disposalDwmy: number;

    disposalDate: Date;

    referredDoctorId: number;

    referredDoctor: string;

    hosType: number;

    employeeCode: string;

    /* for template */
    templateIs: boolean;

    treatmentIs: boolean;

    templateName: string;


}
