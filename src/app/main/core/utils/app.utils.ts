import {LESS_THAN_OR_EQUAL, LESS_THAN_OR_EQUAL_BN, OK, OK_BN, WRONG_DATE, WRONG_DATE_BN} from '../constants/message';
import {SnackbarHelper} from '../helper/snackbar.helper';
import {Injectable} from '@angular/core';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ConfirmDialogConstant} from '../../shared/constant/confirm.dialog.constant';
import {SubmitConfirmationDialogComponent} from '../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {TranslateService} from '@ngx-translate/core';
import {MenuItem} from '../../groups/system-admin/model/menu-item';
import {MenuItemUrl} from '../../groups/system-admin/model/menu-item-url';
import {NavigationStart, Router, RoutesRecognized} from '@angular/router';
import {UserRolePermission} from '../../groups/system-admin/model/user-role-permission';
import {ApprovalUser} from '../../groups/system-admin/model/approval-user';
import {ReportConfigureService} from '../../groups/system-admin/service/report-configure.service';
import {DatePipe} from '@angular/common';
import {LocalStorageHelper} from '../helper/local-storage.helper';

@Injectable({
    providedIn: 'root'
})
export class AppUtils {

    /*module property*/
    MODULE_OFFICER_ID =  5;
    MODULE_STUFF_ID =  8;
    MODULE_TECHNICAL_ID =  157;
    MODULE_RECRUITMENT_ID =  9;
    MODULE_BOF_SECURITY_ID =  226;
    MODULE_ICT_ID =  228;

    /*lang property*/
    langEn: string = 'en';


    constructor(
        private snackbarHelper: SnackbarHelper,
        private matDialog: MatDialog,
        private translate: TranslateService,
        private reportService: ReportConfigureService,
        private router: Router,
        private datePipe: DatePipe,
        private localStorageHelper: LocalStorageHelper,
    ) {
    }

    onServerSuccessResponse(res, reloadPage?): void {
        const message = this.isLocalActive() ? res.messageBn : res.message;
        const okay = this.isLocalActive() ? OK_BN : OK;
        if (res.status) {
            this.snackbarHelper.openSuccessSnackBarWithMessage(message, okay);
            if (reloadPage) {
                reloadPage();
            }
        } else {
            this.snackbarHelper.openErrorSnackBarWithMessage(message, okay);
        }
    }

    onServerErrorResponse(error): void {
        this.snackbarHelper.openErrorSnackBar();
    }

    onServerErrorResponseWithMessage(message: string, error): void {
        this.snackbarHelper.openErrorSnackBarWithMessage(message, error);
    }

    onFailYourPermision(type): void {
        if (type === 1) {
            this.snackbarHelper.openErrorSnackBarWithMessage('do not have insert permission', 'ok');
        } else if (type === 2) {
            this.snackbarHelper.openErrorSnackBarWithMessage('do not have update permission', 'ok');
        } else if (type === 3) {
            this.snackbarHelper.openErrorSnackBarWithMessage('do not have delete permission', 'ok');
        }

    }

    formatSetupFormName(inputName: string): string {
        return inputName.toUpperCase();
    }

    openConfirmDialog(viewModel, callBackDelete): void {
         const dialogConfig = new MatDialogConfig();
         dialogConfig.disableClose = false;
         dialogConfig.autoFocus = false;
         dialogConfig.width = ConfirmDialogConstant.WIDTH;
         dialogConfig.height = ConfirmDialogConstant.HEIGHT;
         dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
         dialogConfig.data = {message: this.isLocalActive() ? ConfirmDialogConstant.MESSAGE_BN : ConfirmDialogConstant.MESSAGE};
         const dialogRef = this.matDialog.open(SubmitConfirmationDialogComponent, dialogConfig);
         dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
             if (res) {
                 callBackDelete(viewModel);
             }
             dialogRef.close(true);
         });
        callBackDelete(viewModel);
    }

    openReloadDialog(viewModel, callBackMethod): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: ConfirmDialogConstant.RE_PROCESS_MESSAGE};
        const dialogRef = this.matDialog.open(SubmitConfirmationDialogComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            if (res) {
                callBackMethod(viewModel);
            }
            dialogRef.close(true);
        });
    }

    isLocalActive(): boolean {
        return this.translate.currentLang === this.langEn ? false : true;
    }


    findUserRolePermission(suffixUrl?: string): UserRolePermission {
        const fullUrl = this.router.url;
        const routerUrl = fullUrl.replace(suffixUrl, '');

        // console.log(routerUrl);

        let userRole = null;
        const data = JSON.parse(localStorage.getItem('userRoles'));
        data.forEach(obj => {
            obj.userRole.rolePermissionList.forEach(role => {
                const menuItemUrl = role.menuItemUrl.menuItem.parent.parent.url ?
                    role.menuItemUrl.menuItem.parent.parent.url + '/' + role.menuItemUrl.menuItem.parent.parent.id + role.menuItemUrl.baseURL :
                    role.menuItemUrl.menuItem.parent.parent.parent.url + '/' + role.menuItemUrl.menuItem.parent.parent.parent.id + role.menuItemUrl.baseURL
                ;
                // console.log(role);
                if (menuItemUrl === routerUrl) {
                    userRole = role;
                }
            });
        });

        if (!userRole) {
            this.router.navigateByUrl('dashboard');
        }

        return userRole;
    }

    getPrefixUrl(): string {
        const routerUrl = this.router.url;
        const urlArray = routerUrl.split('/');
        return '/' + urlArray[1] + '/' + urlArray[2] + '/';
    }

    /*for approval*/
    checkApprovalUser2(officeId: number): ApprovalUser {
        const approvalUserList: ApprovalUser [] = this.localStorageHelper.getApprovalUserList();
        let res: ApprovalUser;
        approvalUserList.forEach(value => {
            if (Number(value.officeid) === officeId) {
                res = value;
            }
        });
        return res;
    }

    findApprovalUser(approvalUserList: ApprovalUser [], userRolePermission: UserRolePermission): ApprovalUser{
        let res = null;
        approvalUserList.forEach(value => {
            // const moduleId = subGroup ? userRolePermission.menuItemUrl.menuItem.parent.parent.id : userRolePermission.menuItemUrl.menuItem.parent.id;
            const module: MenuItem = userRolePermission.menuItemUrl.menuItem.parent.parent ?
                userRolePermission.menuItemUrl.menuItem.parent.parent : userRolePermission.menuItemUrl.menuItem.parent;
            if (value.moduleid === module.id.toString()){
                res = value;
            }
        });
        return res;
    }

    getCurrentMooule(userRolePermission: UserRolePermission, moduleId: number): MenuItem {
        return userRolePermission.menuItemUrl.menuItem.parent.menuType === moduleId ?
            userRolePermission.menuItemUrl.menuItem.parent :
            userRolePermission.menuItemUrl.menuItem.parent.parent;
        // return subGroup ?  userRolePermission.menuItemUrl.menuItem.parent.parent :  userRolePermission.menuItemUrl.menuItem.parent;
    }

    isValidDate(fromDate: Date, fromDateMessage: string, fromDateMessage_bn: string, toDate: Date, toDateMessage: string, toDateMessage_bn: string): boolean {
        if (fromDate > toDate) {
            const massage = this.isLocalActive() ? fromDateMessage_bn + ' ' + toDateMessage_bn +
                LESS_THAN_OR_EQUAL_BN : fromDateMessage + LESS_THAN_OR_EQUAL + toDateMessage;
            const ok = this.isLocalActive() ? OK_BN : OK;
            this.snackbarHelper.openErrorSnackBarWithMessage(massage, ok);
            return false;
        }
        return true;
    }


    // YYYYMMDD
    getDateOnlyAsStringFormateYYYYMMDD(dateReq: Date): string {
        const date = new Date(dateReq);
        const year = date.getFullYear().toString();
        let mounth = (date.getMonth() + 1).toString();
        if (mounth.length === 1) {
            mounth = '0' + mounth;
        }
        let day = date.getDate().toString();
        if (day.length === 1) {
            day = '0' + day;
        }

        const formatedDate = year + mounth + day;
        return formatedDate;
    }

    public calculateAge(dob: Date): string {
        if (dob) {
            const timeDiff = Math.abs(Date.now() - new Date(dob).getTime());
            let seconds = Math.floor(timeDiff / 1000);
            let minutes = Math.floor(seconds / 60);
            let hours   = Math.floor(minutes / 60);
            let days    = Math.floor(hours / 24);
            let months  = Math.floor(days / 30);
            const years   = Math.floor(days / 365);

            seconds %= 60;
            minutes %= 60;
            hours %= 24;
            days %= 30;
            months %= 12;

            /*console.log('Years:', years);
            console.log('Months:', months);
            console.log('Days:', days);
            console.log('Hours:', hours);
            console.log('Minutes:', minutes);
            console.log('Seconds:', seconds);*/

            const yearValue = years > 1 ? 'Years' : 'Year';
            const monthValue = years > 1 ? 'Months' : 'Months';
            const dayValue = years > 1 ? 'Days' : 'Days';

            return years + ' ' + yearValue + ' ' + months + ' ' + monthValue + ' ' + days + dayValue;

        }
        return '';
    }

    public getTotalHourBetweenTime(fromTime, toTime): string{
        let totalHourValue = '';
        if (fromTime && toTime){
            fromTime = this.toTime(fromTime);
            toTime = this.toTime(toTime);

            let milSecDiff = toTime - fromTime;

            if (milSecDiff < 0) {
                milSecDiff = (24 * 60 * 60 * 1000) + milSecDiff;
            }

            const  totalMinutes = milSecDiff / 60 / 1000;
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;

            totalHourValue =  hours + ':' + minutes;
        }
        return totalHourValue;
    }

    toTime(timeString): Date{
        const timeTokens = timeString.split(':');
        return new Date(1970, 0, 1, timeTokens[0], timeTokens[1], 0);
    }


    // Report Calling
    printReport(reportParam: Map<string, string>): any {
        reportParam.set('reportFormat', 'pdf');
        const convMap = {};
        reportParam.forEach((val: string, key: string) => {
            convMap[key] = val;
        });
        // get file from server
        this.reportService.printReport(convMap).subscribe(blob => window.open(window.URL.createObjectURL(blob)));

    }

    public detailsLastEntryDeleteMsg(): void {
        const no = this.isLocalActive() ? 'অন্তত একটি আইটেম প্রয়োজন!' : 'At least one item needed!';
        const ok = this.isLocalActive() ? OK_BN : OK;
        this.snackbarHelper.openErrorSnackBarWithMessage(no, ok);
    }


    /*=============== for time format ===================*/

    getCurrentDate(): Date {
        const currentDate: Date = new Date();
        currentDate.setHours(0, 0, 0, 0);
        return currentDate;
    }

    getTomorrowDate(): Date {
        const currentDate: Date = this.getCurrentDate();
        currentDate.setDate( currentDate.getDate() + 1 );
        return currentDate;
    }

    getCurrentTime(): string {
        const currentDate: Date = new Date();
        const hourValue = currentDate.getHours().toString().length === 1 ? '0' + currentDate.getHours().toString() : currentDate.getHours().toString();
        const minValue = currentDate.getMinutes().toString().length === 1 ? '0' + currentDate.getMinutes().toString() : currentDate.getMinutes().toString();
        return hourValue + ':' + minValue;
    }

    getFirstDayOfCurrentMonth(): Date{
        const date = new Date();
        const y = date.getFullYear();
        const m = date.getMonth();
        return new Date(y, m, 1);
    }

    getReportFormatDate(date): string{
        return  this.datePipe.transform(date, 'yyyy-MM-dd');
    }

    formatTime(fromGroup, control: string, formValue): void {
        const formTimeFormValue = formValue.value;
        // console.log(formTimeFormValue);
        const formTime = formTimeFormValue.length === 3 ? '0' + formTimeFormValue : formTimeFormValue;
        // const formTime = formTimeFormValue.length === 2 ?  formTimeFormValue + '00' : formTimeFormValue;

        if (formTime.length === 4) {
            // console.log(formTime.substring(0, 2));
            let minute = formTime.substring(2, 4);
            if ( Number(minute) > 60){
                minute = 59;
            }else {
                minute = formTime.substring(2, 4);
            }
            // console.log(minute);
            const formatTime = formTime.substring(0, 2) + ':' + minute;
            fromGroup.patchValue({
                [control]: formatTime
            });
        }

    }

    formatDate(fromGroup, control: string, formValue): void {
    }

    validFromDateToDate(fromDateValue, toDateValue): boolean{
        if (fromDateValue && toDateValue ){
            const  fromDate = new Date(fromDateValue);
            const  toDate = new Date(toDateValue);
            if (fromDate > toDate){
                const wrongDate = this.isLocalActive() ? WRONG_DATE_BN : WRONG_DATE;
                const ok = this.isLocalActive() ? OK_BN : OK;
                this.snackbarHelper.openErrorSnackBarWithMessage(wrongDate, ok);
                return false;
            }
        }
        return true;
    }

    getSuffixForApprovalList(module: MenuItem, suffix: string): string {
        let url = '';
        switch (module.id) {
            case this.MODULE_OFFICER_ID:
                url = 'officer-' + suffix;
                break;

            case this.MODULE_STUFF_ID:
                url = 'stuff-' + suffix;
                break;

            case this.MODULE_TECHNICAL_ID:
                url = 'technical-' + suffix;
                break;

            case this.MODULE_RECRUITMENT_ID:
                url = 'recruitment-' + suffix;
                break;

            case this.MODULE_BOF_SECURITY_ID:
                url = 'bof-security-' + suffix;
                break;

            case this.MODULE_ICT_ID:
                url = 'ict-' + suffix;
                break;
        }
        return url;
    }








    /*search value*/
    getBySearchValue(service: any, event: any, setDropdownList, index?, isDetails?): any {
        if (!event){ return; }
        if (event.length > 3) {
            service.getBySearchValue(event).subscribe(res => {
                isDetails ? setDropdownList(index, res.data) : setDropdownList(res.data);
            });
        }else {
            isDetails ? setDropdownList(index, []) : setDropdownList([]);
        }
    }

    setSearchValue(service: any, id: any, setDropdownList, index?, isDetails?): any{
        service.getObjectById(id).subscribe(res => {
            const tempList = [];
            tempList.push(res.data);
            isDetails ? setDropdownList(index, tempList, true) : setDropdownList(tempList, true);
        });
    }




}
