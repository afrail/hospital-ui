import { CommonModelField } from "../../../core/models/common-model-field";
import { ReportMaster } from "./report-master";
import { ReportUpload } from "./report-upload";

export class SubReportMaster extends CommonModelField{

    reportMaster: ReportMaster;
    reportUpload: ReportUpload;
    serial: number;

    //
    name: string;
}
