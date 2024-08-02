import {CommonModelField} from '../../../core/models/common-model-field';
import {CommonResponseList} from '../../../core/models/common-response';
import {DoctorInformation} from './doctor-information';


export class TokenRegister extends CommonModelField {

       patientId: number;
       patientName: string;
       registrationDate: Date;
       age: string;
       nationalId: string;
       identityMark: string;
       presentAddress: string;
        contactNo: string;
      email: string;
      picture: string;

      TokenId: number;
      patientInfo: any;
      tokenType: number;
      visitDate: Date;
      tokenNumber: string;
      referToDoctorName: string ;
      referToDoctorRoom: string;
      referToDoctorId: DoctorInformation;
      primaryProblem: string;
      actionToken: boolean;
      pulse: string;
      bp: string;
      rr: string;
      temp: string;
      height: string;
      weight: string ;
      ofc: string;
      spo2: string;
      absenceIs: number;

}
