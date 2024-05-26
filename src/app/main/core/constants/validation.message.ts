import {environment} from '../../../../environments/environment';
import {DEFAULT_TEXT_AREA_SIZE} from './constant';

export class ValidationMessage {

    public DATE_FORMAT = 'dd/mm/yyyy';
    public TIME_FORMAT = 'HH:mm';
    public PIPE_DATE_FORMAT_FOR_REPORT = 'yyyy-MM-dd';
    public PIPE_DATE_FORMAT = 'dd-MM-yyyy';
    public PIPE_TIME_FORMAT = 'hh:mm a';
    public PIPE_TIME_FORMAT_WITH_SECONDS = 'hh:mm:ss a';
    public PIPE_DATE_TIME_FORMAT = 'dd-MM-yyyy hh:mm a';
    public ADD_DATE_WITH_TIME = '1970-01-01T';
    public TIME_FORMAT_PATTERN = '([01]?[0-9]|2[0-3]):[0-5][0-9]';
    public DATE_FORMAT_PATTERN = '[0-3][0-9]/[0-1][0-9]/[0-9][0-9][0-9][0-9]';

    /*image property*/
    EMPLOYEE_INO_SERVER_URL =  environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleHRM + 'employee-personal-information';
    IMAGE_SERVER_URL = this.EMPLOYEE_INO_SERVER_URL + '/show/';
    SIGNATURE_SERVER_URL = this.EMPLOYEE_INO_SERVER_URL + '/show/signature/';
}
