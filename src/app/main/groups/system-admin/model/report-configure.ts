import { ParameterMaster } from './parameter-master';
import { ReportMaster } from './report-master';
import { CommonModelField } from "app/main/core/models/common-model-field";
import { MenuItem } from './menu-item';

export class ReportConfigure extends CommonModelField{
    reportMaster: ReportMaster;
    module: MenuItem;
    reportFormat: string;


    //
    name: string;
}
