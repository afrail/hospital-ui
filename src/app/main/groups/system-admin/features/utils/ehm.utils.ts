import {Injectable} from '@angular/core';
import {DoctorInformation} from '../../model/doctor-information';
import {TOKEN_REGISTER_EMERGENCY_ID} from '../../../../core/constants/type';
import {EmpUnitService} from '../../service/emp-unit.service';



@Injectable({
    providedIn: 'root'
})
export class EhmUtils {

    /*for control on fly add item*/
    public medicineDialog: number = 1;
    public doseDialog: number = 2;
    public instructionDialog: number = 3;
    public investigationDialog: number = 4;
    public diseaseDialog: number = 5;
    public illnessDialog: number = 6;
    public ccDialog: number = 7;
    public adviceDialog: number = 8;
    public refDocDialog: number = 9;
    public disposalDialog: number = 10;

    /*for control on fly add medicine*/
    public mescGroupId: number = 205;
    public unitId: number = 70;

    /*prescription auto fill properties*/
    public pulseId: number = 1;
    public pulseSuffix: string = '/min';

    public bpId: number = 2;
    public bpSuffix: string = 'mmhg';

    public tempId: number = 3;
    public tempSuffix: string = '°F';

    public heightId: number = 4;
    public heightSuffix: string = '"';

    public weightId: number = 5;
    public weightSuffix: string = 'KG';

    public spo2Id: number = 7;
    public spo2Suffix: string = '%';


    constructor(
        private unitService: EmpUnitService,
    ) {
    }

    getPatientName(pat: any): string {
        if (!pat) {
            return '';
        }

        return pat.relationType ?
            pat.relationType.name + ' Of ' + '(' + pat.patient.patientCode + ')' + pat.patient.patientName
            : '(' + pat.patientCode + ')' + pat.patientName;
    }

    getPatientNameWithOutRelation(pat: any): string {
        return pat ? '(' + pat.patientCode + ')' + pat.patientName : '';
    }

    getDoctorName(doctor: DoctorInformation): string {
        return doctor ?
            doctor.name + ',' + doctor.doctorRank
            : '';
    }

    public getPatientRank(patientInfo: any): string {
        if (!patientInfo) {
            return '';
        }
        let rankInfo = patientInfo.rank ? patientInfo.rank.name :
            patientInfo.designation ? patientInfo.designation.name : '';
        rankInfo = !rankInfo ? patientInfo.designationName : rankInfo;
        return rankInfo;
    }



    getFullMedicineStock(medicineMaster: any, menuType: number): string {
        if (!medicineMaster) {
            return '';
        }
        if (menuType === TOKEN_REGISTER_EMERGENCY_ID) {
            const emergencyStoreStock: number = medicineMaster.availableStockEmergency ? medicineMaster.availableStockEmergency : 0;
            return emergencyStoreStock.toString();
        }
        const mainStoreStock: number = medicineMaster.availableStock ? medicineMaster.availableStock : 0;
        const subStoreStock: number = medicineMaster.availableStockSub ? medicineMaster.availableStockSub : 0;
        // const totalStock: number =  mainStoreStock + subStoreStock + emergencyStock;
        const totalStock: number = mainStoreStock + subStoreStock;
        return totalStock.toString();
    }

    convertNumber(eng: string): any {
        let bengali = '';
        for (let i = 0; i < eng.toString().length; i++) {

            switch (eng.toString()[i]) {
                case '1':
                    bengali = bengali + '১';
                    break;
                case '2':
                    bengali = bengali + '২';
                    break;
                case '3':
                    bengali = bengali + '৩';
                    break;
                case '4':
                    bengali = bengali + '৪';
                    break;
                case '5':
                    bengali = bengali + '৫';
                    break;
                case '6':
                    bengali = bengali + '৬';
                    break;
                case '7':
                    bengali = bengali + '৭';
                    break;
                case '8':
                    bengali = bengali + '৮';
                    break;
                case '9':
                    bengali = bengali + '৯';
                    break;
                default:
                    bengali = bengali + '0';
            }
        }
        return bengali;
    }

}
