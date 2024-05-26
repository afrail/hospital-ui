import { CommonModelField } from "app/main/core/models/common-model-field";

export class ReportUpload extends CommonModelField{

    fileName: string;
    fileLocation: string;
    fileNameParams: string;
    remarks: string;
    isSubreport: boolean;

}
