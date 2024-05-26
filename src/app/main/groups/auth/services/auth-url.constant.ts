import { environment } from 'environments/environment';


export class AuthUrlConstant {
    public static OAUTH_ENDPOINT = environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + 'auth/signin';
    public static SIGNUP_ENDPOINT = environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + 'auth/doctor-signup';
    public static RESET_PASSWORD_ENDPOINT = environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + 'auth/reset-password';
}
