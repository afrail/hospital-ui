import { CommonModelField } from "app/main/core/models/common-model-field";
import { MenuItem } from "./menu-item";
import { ReportUpload } from "./report-upload";

export class ReportMaster extends CommonModelField{

    reportTitle: string;
    //banglaName: string;
    module: MenuItem;
    reportUpload: ReportUpload;
    serial: number;

    //
    name: string;
}
