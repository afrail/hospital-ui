import {PatientPrescriptionChiefComplaint} from '../../../model/patient-prescription-chief-complaint';
import {PatientPrescriptionDisease} from '../../../model/patient-prescription-disease';
import {PatientPrescriptionInvestigation} from '../../../model/patient-prescription-investigation';
import {PatientPrescriptionInvestigationFinding} from '../../../model/patient-prescription-investigation-finding';
import {PatientPrescriptionAdvice} from '../../../model/patient-prescription-advice';
import {PatientPrescriptionReferredDoctor} from '../../../model/patient-prescription-referred-doctor';
import {PatientPrescriptionDisposal} from '../../../model/patient-prescription-disposal';
import {OnExamination} from '../../../model/on-examination';
import {PatientPrescriptionTreatment} from '../../../model/patient-prescription-treatment';
import {PatientPrescriptionMaster} from '../../../model/patient-prescription-master';


export class PatientPrescriptionRequest {

    master: PatientPrescriptionMaster;
    ccList: PatientPrescriptionChiefComplaint [];
    diseaseList: PatientPrescriptionDisease [];
    investigationList: PatientPrescriptionInvestigation [];
    investigationFindingList: PatientPrescriptionInvestigationFinding [];
    treatmentList: PatientPrescriptionTreatment [];
    adviceList: PatientPrescriptionAdvice [];
    referredDoctorList: PatientPrescriptionReferredDoctor [];
    disposalList: PatientPrescriptionDisposal [];
    onExaminationList: OnExamination [];
    pastIllHistoryList: any [];

}
