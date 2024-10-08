import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StorageUtils {

    /*local storage property*/
    LOCAL_KEY_NAME = 'filterValue';

    /*p-1*/
    EMP_OFFICER_STORAGE_ID = 9001;
    EMP_STUFF_STORAGE_ID = 9002;
    EMP_WORKMAN_STORAGE_ID = 9003;
    COMMON_CIR_SEARCH_STORAGE_ID = 2;
    RESULT_SETUP_SEARCH_STORAGE_ID = 3;
    APPLICATION_INFO_SEARCH_STORAGE_ID = 4;
    RESULT_ENTRY_SEARCH_STORAGE_ID = 5;
    RESULT_PROCESS_SEARCH_STORAGE_ID = 6;
    TAINING_INFO_DETAILS_SEARCH_STORAGE_ID = 7;
    LETTER_REGISTER_DETAILS_SEARCH_STORAGE_ID = 8;
    EMPLOYEE_LEAVE_APP_SEARCH_STORAGE_ID = 9;
    EMPLOYEE_MOVEMENT_INFO_SEARCH_STORAGE_ID = 10;
    OFFICE_BOARD_INFO_SEARCH_STORAGE_ID = 11;
    CASUALITY_WRITTEN_REGISTER_SEARCH_STORAGE_ID = 12;
    DUTY_POINT_ROSTER_DEC_SEARCH_STORAGE_ID = 13;
    PETROL_DUTY_SEARCH_STORAGE_ID = 14;
    PETROL_DUTY_DEC_SEARCH_STORAGE_ID = 15;
    MODC_EMPLOYEE_PRO_SEARCH_STORAGE_ID = 16;
   // ARMS_AMMUNITION_ISSUE_SEARCH_STORAGE_ID = 17;
    MODC_DUTY_ROSTER_SEARCH_STORAGE_ID = 18;
    MODC_CASUAL_DUTY_ROSTER_SEARCH_STORAGE_ID = 19;
    DOG_ITEM_INDENT_SEARCH_STORAGE_ID = 20;
    DOG_ITEM_RECEIVE_SEARCH_STORAGE_ID = 21;
    DAILY_DOG_FOOD_DISTRIBUTION_SEARCH_STORAGE_ID = 22;
    OBSERVATION_PERFORMANCE_ENTRY_SEARCH_STORAGE_ID = 23;
    DOG_ARMS_ISSUE_RECEIVE_SEARCH_STORAGE_ID = 24;
   // KEY_ISSUE_REGISTER_SEARCH_STORAGE_ID = 25;
    GATE_PASS_REQUEST_INOUT_SEARCH_STORAGE_ID = 26;
    GOODS_INOUT_SEARCH_STORAGE_ID = 27;
    GATE_PASS_INOUT_SEARCH_STORAGE_ID = 28;
    EMPLOYEE_ID_REQUEST_SEARCH_STORAGE_ID = 29;
    EMPLOYEE_ROSTER_SEARCH_STORAGE_ID = 30;
    OVERTIME_SETUP_SEARCH_STORAGE_ID = 31;
    ATTENDANCE_DETAILS_SEARCH_STORAGE_ID = 32;
    INSTANT_GATE_PASS_APPLICATION_SEARCH_STORAGE_ID = 33;
    VEHICLE_INOUT_SEARCH_STORAGE_ID = 34;
    EMPLOYEE_INOUT_MID_NIGHT_SEARCH_STORAGE_ID = 35;
    DAILY_LABOUR_COMPANY_SEARCH_STORAGE_ID = 36;
    DAILY_LABOUR_SEARCH_STORAGE_ID = 37;
    PERSONAL_SKILL_SETUP_SEARCH_STORAGE_ID = 38;
    ITEM_INDENT_ICT_SEARCH_STORAGE_ID = 39;
    ITEM_RECEIVED_ICT_SEARCH_STORAGE_ID = 40;
    ITEM_ISSUE_ICT_SEARCH_STORAGE_ID = 41;
    ITEM_RETURN_ICT_SEARCH_STORAGE_ID = 42;



    /*P-2*/
    COMM_DAILY_ORDER_PART2_ID = 201 ;
    DAILY_ORDER_SUBSIDIARY_BILL = 2002 ;
    NOTE_SHEET_SUBSIDIARY_BILL = 2003 ;
    RV_SUBSIDIARY_BILL = 2004 ;
    DRW_FILE_ACCESS_REQUEST_ID = 203 ;
    BUDGET_BILL_ID = 204 ;
    DRW_FILE_INFORMATION_ID = 205 ;
    DRW_BOOK_INFORMATION_ID = 2050 ;
    BUDGET_TRANSACTION_ID = 206 ;
    BUDGET_DEMAND_ID = 207 ;
    LOCAL_TADA_BILL_ID = 208;
    FOREIGN_TADA_BILL_ID = 2088;
    TRANSFER_ID = 20888;
    BUDGET_DEMAND_ANALYSIS_ID = 209;
    AUDIT_OBJECTION_ID = 210;
    LOAN_ENTRY_ID = 211;
    RATION_SALE_ID = 212;
    RATION_RECEIVE_ID = 2212;
    RATION_EVENT_ID = 213;
    RATION_CONFIG_ID = 2213;
    RATION_RATE_CONFIG_ID = 2214;
    RATION_CLUB_RENT_ID = 214;
    RATION_EMPLOYEE_ID = 214444;
    CASH_DIPOSIT_ID = 215;
    MEDICINE_DEMAND_ID = 216;
    DENTAL_ITEM_DEMAND_ID = 260;
    DENTAL_ITEM_DELIVERY_ID = 2600;
    MEDICINE_DEMAND_SUB_STORE_ID = 227;
    MEDICINE_DEMAND_EMERGENCY_ID = 22701;
    MEDICINE_DEMAND_DENTAL_ID = 22700011;

    MEDICINE_DELIVERY_ID = 2160;
    MEDICINE_DELIVERY_SUB_STORE_ID = 2270;
    MEDICINE_DELIVERY_EMERGENCY_ID = 227010;

    CASH_RECEIVE_ID = 217;
    DAY_CARE_ID = 218;
    PATIENT_INFO_ID = 219;
    PATIENT_INFO_MISCELLANEOUS_ID = 228;
    PATIENT_INFO_RELATIVE_ID = 229;
    PATIENT_INFO_DENTAL_ID = 2340;
    PATIENT_INFO_MISCELLANEOUS_DENTAL_ID = 2350;
    PATIENT_INFO_RELATIVE_DENTAL_ID = 2360;
    WELFARE_SCHORLARSHIP_ID = 224;
    PATIENT_ADMISSION_ID = 220;
    TOKEN_REG_ID = 221;
    TOKEN_REG_DENTAL_ID = 232;
    TOKEN_REG_EMERGENCY_ID = 23201;
    PATIENT_PRESCRIPTION_ID = 222;
    PATIENT_PRESCRIPTION_DENTAL_ID = 233;
    PATIENT_PRESCRIPTION_EMERGENCY_ID = 23301;
    INVESTIGATION_ENTRY_ID = 23305;
    MEDICINE_RECEIVE_ID = 223;
    ISSUE_MAIN_TO_SUB = 22301;
    ISSUE_MAIN_TO_EMERGENCY_ID = 22302;
    ISSUE_SUB_TO_EMERGENCY_ID = 22303;
    PENSION_REF_GOVT_ID = 223;
    SECTION_WISE_OVER_TIME_ID = 224;
    BUDGET_DEMAND_APPROVE_ID = 226;
    BOOK_REGISTRY_ID = 227;
    DOCTOR_INFORMATION_ID = 230;
    DOCTOR_INFORMATION_DENTAL_ID = 231;
    OUT_SOURCE_EMPLOYEE_ATTENDANCE_ID = 2331;


    DRAWING_LOCKER_ID = 224;
    DRAWING_INVENTORY_CONSUMER_RECEIVE_ID = 225;
    DRAWING_INVENTORY_CONSUMER_ISSUE_ID = 226;
    PENSION_REFERENCE_NO = 300;
    PENSION_RATE = 600;
    DRAWING_FILE_UPLOAD_FILTER_ID = 400;
    DRW_FILE_ACCESS_APPROVE_MANAGER_ID = 405;
    DRW_FILE_ACCESS_APPROVE_USER_ID = 410;

    PENSION_REFERENCE_DOCUMENT_ID = 601;

    constructor(
    ) {
    }

    getSearchStorageValue(): any{
        if (localStorage.getItem(this.LOCAL_KEY_NAME)){
            return  JSON.parse(localStorage.getItem(this.LOCAL_KEY_NAME));
        }
        return null;
    }

    setSearchStorageValue(model: any): void{
        localStorage.setItem(this.LOCAL_KEY_NAME, JSON.stringify(model));
    }




}
