import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {ValidationMessage} from 'app/main/core/constants/validation.message';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {AppUtils} from 'app/main/core/utils/app.utils';
import {UserRolePermission} from 'app/main/groups/system-admin/model/user-role-permission';
import {DEFAULT_TEXT_AREA_SIZE} from 'app/main/core/constants/constant';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ActivatedRoute, Router} from '@angular/router';

import { AppUser } from '../../model/app-user';
import { DoctorInformation } from '../../model/doctor-information';
import { DoctorInformationService } from '../../service/doctor-information.service';
import {TokenRegister} from '../../model/token-register';
import {TokenRegisterService} from '../../service/token-register.service';

@Component({
    selector: 'app-token-register-add',
    templateUrl: './token-register-add.component.html',
    styleUrls: ['./token-register-add.component.scss']
})
export class TokenRegisterAddComponent implements OnInit {

    /*property*/
    prefixUrl: string;
    menuType: number;
    day: number;
    toDate: Date;
    editValue: boolean;
    searchLoader: boolean = false;
    searchLoaderpatientInfo: boolean = false;
    textAreaSize: number = DEFAULT_TEXT_AREA_SIZE;
    validationMsg: ValidationMessage = new ValidationMessage();
    userRolePermission: UserRolePermission;
    userInfo: AppUser;

    // object
    frmGroup: FormGroup;
    model: TokenRegister = new TokenRegister();
    tokenRegisters: TokenRegister;
    displayedColumns: string[] = ['patientName', 'patient', 'age', 'isChronic', 'action'];

    /*Dropdown*/
    doctorDropdownList: DoctorInformation[] = new Array<DoctorInformation>();

    medicineCollectionId: number = 27;


    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------
    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private modelService: TokenRegisterService,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private snackbarHelper: SnackbarHelper,
        private matDialog: MatDialog,
        private doctorInformationService: DoctorInformationService,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private appUtils: AppUtils,
    ) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.userRolePermission = this.appUtils.findUserRolePermission();
    }
    // -----------------------------------------------------------------------------------------------------
    // @ API calling
    // -----------------------------------------------------------------------------------------------------


    ngOnInit(): void {
        this.prefixUrl = this.appUtils.getPrefixUrl();
        this.setFormInitValue();
        this.getDoctorList();
        if (history.state.id) {
            this.model = history.state;
            this.edit(this.model);
        }
    }

    getDoctorList(): void {
        this.doctorInformationService.getActiveList().subscribe(res => {
            this.doctorDropdownList = res.data.map(m => ({
                ...m,
                name: m.name + ' , ' + m.specialFor
            }));
            if (this.model.TokenId){
                 const select = this.doctorDropdownList.find(m => m.id === this.model.referToDoctorId.id);
                 this.frmGroup.patchValue({
                    referToDoctorName: select
                });
            }
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ view method

    onSubmit(): void {
        if (!this.userRolePermission.insert) {
            this.appUtils.onFailYourPermision(1);
            return;
        }
        this.generateModel(true);
        this.searchLoader = true;
        this.modelService.create(this.model).subscribe(res => {
            this.searchLoader = false;
            this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
        }, error => {
            this.appUtils.onServerErrorResponse(error);
            this.searchLoader = false;
        });

    }

    update(): void {
        if (!this.userRolePermission.edit) {
            this.appUtils.onFailYourPermision(2);
            return;
        }

        this.generateModel(false);
        this.searchLoader = true;
        this.modelService.update(this.model).subscribe(res => {
            this.searchLoader = false;
            this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
        }, error => {
            this.appUtils.onServerErrorResponse(error);
            this.searchLoader = false;
        });
    }

    // -----------------------------------------------------------------------------------------------------
    edit(res: TokenRegister): void {
        this.editValue = true;
        this.model = res;
        this.frmGroup.patchValue({
            patientName: res.patientName,
            registrationDate: res.registrationDate,
            age: res.age,
            nationalId: res.nationalId,
            identityMark: res.identityMark,
            presentAddress: res.presentAddress,
            contactNo: res.contactNo,
            referToDoctor: res.referToDoctorId,
            email: res.email,
            picture: res.picture,
            TokenId: res.TokenId,
            patientInfo: res.patientInfo,
            tokenType: res.tokenType,
            visitDate: res.visitDate,
            tokenNumber: res.tokenNumber,
            primaryProblem: res.primaryProblem,
            actionToken: res.actionToken,
            pulse: res.pulse,
            bp: res.bp,
            temp: res.temp,
            height: res.height,
            weight: res.weight,
            ofc: res.ofc,
            spo2: res.spo2,
            active: res.active,
        });
    }


   getPatientContactNumber(): void{
       const date: string = this.frmGroup.value.contactNo;

       this.modelService.getPatientPhoneNumber(date).subscribe(res =>{
           console.log(res.data);
            if (res.data){
                this.frmGroup.patchValue({
                    patientName: res.data.patientName,
                    registrationDate: res.data.registrationDate,
                    age: res.data.age,
                    contactNo: res.data.contactNo,
                    patientInfo: res.data,
                });
            }
        });
   }
    resetFromData(): void {
        this.setFormInitValue();
        this.editValue = false;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------

    setFormInitValue(): void {
        this.frmGroup = this.formBuilder.group({

            patientName: ['', ''],
            registrationDate: ['', ''],
            age: ['', ''],
            nationalId: ['', ''],
            identityMark: ['', ''],
            presentAddress: ['', ''],
            contactNo: ['', ''],
            email: ['', ''],
            picture: ['', ''],

            TokenId: ['', ''],
            patientInfo: ['', ''],
            tokenType: ['', ''],
            visitDate: ['', ''],
            visitType: ['', ''],
            tokenNumber: ['', ''],
            referToDoctorName: ['', Validators.required],
            referToDoctorRoom: ['', ''],
            primaryProblem: ['', ''],
            actionToken: ['', ''],
            pulse: ['', ''],
            bp: ['', ''],
            temp: ['', ''],
            height: ['', ''],
            weight: ['', ''],
            ofc: ['', ''],
            spo2: ['', ''],
            active: [true, ''],
        });
    }

    generateModel(isCreate: boolean): void {
        if (isCreate) {
            this.model.id = undefined;
        }
        this.model.patientName = this.frmGroup.value.patientName;
        this.model.registrationDate = this.frmGroup.value.visitDate;
        this.model.age =  this.frmGroup.value.age;
        this.model.contactNo = this.frmGroup.value.contactNo;

           /* TokenId: res.TokenId,*/
        this.model.patientInfo = this.frmGroup.value.patientInfo ? this.frmGroup.value.patientInfo: null;
        this.model.visitDate = this.frmGroup.value.visitDate;
        this.model.tokenNumber = this.frmGroup.value.tokenNumber;
        this.model.referToDoctorName = this.frmGroup.value.referToDoctorName.name;
        this.model.referToDoctorRoom = this.frmGroup.value.referToDoctorName.roomNo;
        this.model.referToDoctorId = this.frmGroup.value.referToDoctorName ? this.frmGroup.value.referToDoctorName : null;
        this.model.primaryProblem = this.frmGroup.value.primaryProblem;
        this.model.actionToken = this.frmGroup.value.actionToken;
        this.model.pulse = this.frmGroup.value.pulse;
        this.model.bp = this.frmGroup.value.bp;
        this.model.temp = this.frmGroup.value.temp;
        this.model.height = this.frmGroup.value.height;
        this.model.weight = this.frmGroup.value.weight;
        this.model.ofc = this.frmGroup.value.ofc;
        this.model.spo2 = this.frmGroup.value.spo2;

    }



    reloadPage(): void {
        this.resetFromData();
    }

    /*call back*/

    viewList(): any {
            const subUrl = this.prefixUrl + 'token-register';
            return subUrl;
    }
}
