import { ParameterMaster } from './parameter-master';
import { ReportMaster } from './report-master';
import { CommonModelField } from "app/main/core/models/common-model-field";

export class ReportWithParameter extends CommonModelField{
    reportMaster: ReportMaster;
    parameterMaster: ParameterMaster
    sql: string;
    serial: number;
    required: boolean;
    dropdownListData: string;


    //
    name: string;
}
