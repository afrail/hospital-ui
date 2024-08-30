import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';
import {locale as lngEnglish} from '../i18n/en';
import {locale as lngBangla} from '../i18n/bn';
import {MatTableDataSource} from '@angular/material/table';
import {TokenRegisterService} from '../../../service/token-register.service';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {
    PrescriptionHistoryDailogComponent
} from '../dialog/prescription-history-dailog/prescription-history-dailog.component';
import {ActivatedRoute, Router} from '@angular/router';
import {DoctorInformationService} from '../../../service/doctor-information.service';
import {DoctorInformation} from '../../../model/doctor-information';
import { DEFAULT_TEXT_AREA_SIZE } from 'app/main/core/constants/constant';
import {ValidationMessage} from '../../../../../core/constants/validation.message';
import { UserRolePermission } from '../../../model/user-role-permission';
import { AppUser } from '../../../model/app-user';
import { PatientPrescriptionRequest } from '../request/patient-prescription-request';
import { TokenRegister } from '../../../model/token-register';
import { BehaviorSubject } from 'rxjs';
import { CommonLookupDetails } from '../../../model/common-lookup-details';
import { PatientPrescriptionMasterService } from '../../../service/patient-prescription-master.service';
import { EhmCommonLookupDetailsService } from '../../../service/ehm-common-lookup-details.service';
import { SnackbarHelper } from 'app/main/core/helper/snackbar.helper';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { EhmUtils } from '../../utils/ehm.utils';
import { AppUtils } from 'app/main/core/utils/app.utils';
import { LocalStorageHelper } from 'app/main/core/helper/local-storage.helper';
import { DatePipe } from '@angular/common';
import {TOKEN_REGISTER_DENTAL_ID, TOKEN_REGISTER_EMERGENCY_ID, TOKEN_REGISTER_ID} from 'app/main/core/constants/type';
import {
    EHM_ADVICE_ID,
    EHM_CC_ID,
    EHM_DISEASE_ID, EHM_DISPOSAL_ID, EHM_DOSE_ID,
    EHM_FOLLOWUP_COMMENT, EHM_INSTRUCTION_ID, EHM_INVESTIGATION_ID,
    EHM_ON_EXAMINATION, EHM_REF_DOC_ID
} from '../../../../../core/constants/common-lookup.constant';
import {MedicineMasterService} from '../../../service/medicine-master.service';
import {DWMY, DWMYService} from '../../../mock-api/dwmy.service';
import {PatientPrescriptionTreatment} from '../../../model/patient-prescription-treatment';
import {PatientPrescriptionInvestigationFinding} from '../../../model/patient-prescription-investigation-finding';
import {PatientPrescriptionChiefComplaint} from '../../../model/patient-prescription-chief-complaint';
import {PatientPrescriptionDisease} from '../../../model/patient-prescription-disease';
import {PatientPrescriptionInvestigation} from '../../../model/patient-prescription-investigation';
import {PatientPrescriptionAdvice} from '../../../model/patient-prescription-advice';
import {OnExamination} from '../../../model/on-examination';
import {PatientPrescriptionReferredDoctor} from '../../../model/patient-prescription-referred-doctor';
import {PatientPrescriptionDisposal} from '../../../model/patient-prescription-disposal';
import {ConfirmDialogConstant} from '../../../../../shared/constant/confirm.dialog.constant';
import {
    SubmitConfirmationDialogComponent
} from '../../../../../shared/components/submit-confirmation-dialog/submit-confirmation-dialog.component';
import {PatientPrescriptionMaster} from '../../../model/patient-prescription-master';
import {DATA_TAKEN, DATA_TAKEN_BN, OK, OK_BN} from '../../../../../core/constants/message';
import {CommonLookupMaster} from '../../../model/common-lookup-master';
import {PatientIllnessHistoryService} from '../../../service/patient-illness-history.service';
import {MedicineMaster} from '../../../model/medicine-master';



@Component({
    selector: 'app-patient-prescription-add',
    templateUrl: './patient-prescription-add.component.html',
    styleUrls: ['./patient-prescription-add.component.scss']
})
export class PatientPrescriptionAddComponent implements OnInit {

    /*property*/
    prefixUrl: string;
    menuType: number;
    editValue: boolean;
    searchLoader: boolean = false;
    prescriptionScanLoader: boolean = false;
    getMedicine: boolean = false;
    textAreaSize: number = DEFAULT_TEXT_AREA_SIZE;
    validationMsg: ValidationMessage = new ValidationMessage();
    userRolePermission: UserRolePermission;
    userInfo: AppUser;
    filterNamePrescription: string = '';
    langEn: string = 'en';
    dwmyDropdownList: DWMY[] = new Array<DWMY>();

    // object
    frmGroup: FormGroup;
    model: PatientPrescriptionRequest = new PatientPrescriptionRequest();
    tokenRegisterModel: TokenRegister = new TokenRegister();
    modelList: PatientPrescriptionRequest[] = new Array<PatientPrescriptionRequest>();

    tokenRegister: TokenRegister;
    patientInfo: any;
    tokenRegisterList: TokenRegister[] = new Array<TokenRegister>();
    dataSource = new MatTableDataSource(this.tokenRegisterList);
    displayedColumns: string[] = ['tokenNumber', 'patient', 'dialog'];

    /*past illness*/
    pastIllDisplayColumnsDetails = ['illnessName', 'disposal', 'action'];
    pastIllDataSourceDetails = new BehaviorSubject<AbstractControl[]>([]);
    pastIllRows: FormArray = this.formBuilder.array([]);
    pastIllFrmGroupDetails: FormGroup = this.formBuilder.group({
        scope: this.pastIllRows
    });

    /*chief complaint*/
    ccDisplayColumnsDetails = ['chiefComplaint', 'action'];
    ccDataSourceDetails = new BehaviorSubject<AbstractControl[]>([]);
    ccRows: FormArray = this.formBuilder.array([]);
    ccFrmGroupDetails: FormGroup = this.formBuilder.group({
        scope: this.ccRows
    });

    /*teeth info*/
    teethDisplayColumnsDetails = ['teethInfo'];
    teethDataSourceDetails = new BehaviorSubject<AbstractControl[]>([]);
    teethRows: FormArray = this.formBuilder.array([]);
    teethFrmGroupDetails: FormGroup = this.formBuilder.group({
        scope: this.teethRows
    });

    /*investigation finding*/
    investigationFindDisplayColumnsDetails = ['investigation', 'finding', 'action'];
    investigationFindDataSourceDetails = new BehaviorSubject<AbstractControl[]>([]);
    investigationFindRows: FormArray = this.formBuilder.array([]);
    investigationFindFrmGroupDetails: FormGroup = this.formBuilder.group({
        scope: this.investigationFindRows
    });

    /*disease*/
    diseaseDisplayColumnsDetails = ['disease', 'onExamination', 'action'];
    diseaseDataSourceDetails = new BehaviorSubject<AbstractControl[]>([]);
    diseaseRows: FormArray = this.formBuilder.array([]);
    diseaseFrmGroupDetails: FormGroup = this.formBuilder.group({
        scope: this.diseaseRows
    });

    /*investigation*/
    investigationDisplayColumnsDetails = ['investigation', 'action'];
    investigationDataSourceDetails = new BehaviorSubject<AbstractControl[]>([]);
    investigationRows: FormArray = this.formBuilder.array([]);
    investigationFrmGroupDetails: FormGroup = this.formBuilder.group({
        scope: this.investigationRows
    });

    /*medicine*/
    medicineDisplayColumnsDetails = ['serialNo', 'medicineMaster', 'stock', 'dose', 'duration', 'dwmy', 'qty', 'instruction', 'continueIs', 'action'];
    medicineDataSourceDetails = new BehaviorSubject<AbstractControl[]>([]);
    medicineRows: FormArray = this.formBuilder.array([]);
    medicineFrmGroupDetails: FormGroup = this.formBuilder.group({
        scope: this.medicineRows
    });

    /*advice*/
    adviceDisplayColumnsDetails = ['advice', 'action'];
    adviceDataSourceDetails = new BehaviorSubject<AbstractControl[]>([]);
    adviceRows: FormArray = this.formBuilder.array([]);
    adviceFrmGroupDetails: FormGroup = this.formBuilder.group({
        scope: this.adviceRows
    });

    // referred Doctor
    referredDoctorDisplayColumnsDetails = ['referredDoctor', 'action'];
    referredDoctorDataSourceDetails = new BehaviorSubject<AbstractControl[]>([]);
    refDocRows: FormArray = this.formBuilder.array([]);
    referredDoctorFrmGroupDetails: FormGroup = this.formBuilder.group({
        scope: this.refDocRows
    });

    /*disposal*/
    disposalDisplayColumnsDetails = ['disposalId', 'duration', 'dwmy', 'disposalDate', 'action'];
    disposalDataSourceDetails = new BehaviorSubject<AbstractControl[]>([]);
    disposalRows: FormArray = this.formBuilder.array([]);
    disposalFrmGroupDetails: FormGroup = this.formBuilder.group({
        scope: this.disposalRows
    });

    /*onExamination*/
    onExaminationDisplayColumnsDetails = ['onExamination', 'action'];
    onExaminationDataSourceDetails = new BehaviorSubject<AbstractControl[]>([]);
    onExaminationRows: FormArray = this.formBuilder.array([]);
    onExaminationFrmGroupDetails: FormGroup = this.formBuilder.group({
        scope: this.onExaminationRows
    });

    /*Dropdown*/
    ccDropdownList: CommonLookupDetails[] = new Array<CommonLookupDetails>();
    followupCommentDropdownList: CommonLookupDetails[] = new Array<CommonLookupDetails>();
    diseaseDropdownList: CommonLookupDetails[] = new Array<CommonLookupDetails>();
    investigationDropdownList: CommonLookupDetails[] = new Array<CommonLookupDetails>();
    onExaminationDropdownList: CommonLookupDetails[] = new Array<CommonLookupDetails>();
    detailsDynamicSearchList: any[] = new Array<any>();
    adviceDropdownList: CommonLookupDetails[] = new Array<CommonLookupDetails>();
    doseDropdownList: CommonLookupDetails[] = new Array<CommonLookupDetails>();
    instructionDropdownList: CommonLookupDetails[] = new Array<CommonLookupDetails>();
    templateDropdownList: PatientPrescriptionRequest[] = new Array<PatientPrescriptionRequest>();
    refDocDropdownList: CommonLookupDetails[] = new Array<CommonLookupDetails>();
    disposalDropdownList: CommonLookupDetails[] = new Array<CommonLookupDetails>();
    globalMedicineList: MedicineMaster[] = new Array<MedicineMaster>();
    /*extra*/
    doctorInformation: DoctorInformation;

    /*id for pass search*/
    isDental: boolean;
    diseaseId: number;
    ccId: number;
    folloupComId: number;
    onExamId: number;
    investigationId: number;
    doseId: number;
    instructionId: number;
    adviceId: number;
    refDocId: number;
    dosposalId: number;

    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------
    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private modelService: PatientPrescriptionMasterService,
        private doctorInformationService: DoctorInformationService,
        private ehmCommonLookupDetailsService: EhmCommonLookupDetailsService,
        private medicineMasterService: MedicineMasterService,
        private tokenService: TokenRegisterService,
        private dwmyService: DWMYService,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private snackbarHelper: SnackbarHelper,
        private matDialog: MatDialog,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private appUtils: AppUtils,
        private ehmUtils: EhmUtils,
        private localStorageHelper: LocalStorageHelper,
        private datePipe: DatePipe,
        private illnessHistoryService: PatientIllnessHistoryService
    ) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.userRolePermission = this.appUtils.findUserRolePermission('/add');
    }

    ngOnInit(): void {
        this.userInfo = this.localStorageHelper.getUserInfo();
        this.prefixUrl = this.appUtils.getPrefixUrl();
        this.getAllMedicine();
        this.setFormInitValue();
        this.getDoctorInfo();
        this.getTemplateList();
        this.getTokenForCurrentDoctor();
        this.getInvestigationList();
        this.getCCList();
        this.getDiseaseList();
        this.getAdviceList();
        this.getReferList();
        this.getDisposalList();
        this.getDoseList();
        this.pastIllAddRow();
        this.model = history.state.res;
        if (this.model && this.model.master) {
            this.edit(this.model);
        }
        this.getDWMYList();
        this.ccAddRow();
        this.investigationFindAddRow();
        this.diseaseAddRow();
        this.investigationAddRow();
        this.medicineAddRow(null, null, null, true);
        this.adviceAddRow();
        this.refDocAddRow();
        this.disposalAddRow();
        this.onExaminationAddRow();
        this.getFollowupComments();

        /*id for pass search*/
        this.isDental = this.menuType === TOKEN_REGISTER_DENTAL_ID;
        this.diseaseId = EHM_DISEASE_ID;
        this.ccId = EHM_CC_ID;
        this.folloupComId = EHM_FOLLOWUP_COMMENT;
        this.onExamId = EHM_ON_EXAMINATION;
        this.investigationId = EHM_INVESTIGATION_ID;
        this.doseId = EHM_DOSE_ID;
        this.instructionId = EHM_INSTRUCTION_ID;
        this.adviceId = EHM_ADVICE_ID;
        this.refDocId = EHM_REF_DOC_ID;
        this.dosposalId = EHM_DISPOSAL_ID;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ API calling
    // -----------------------------------------------------------------------------------------------------


    getAllMedicine(): void {
        this.medicineMasterService.getActiveList().subscribe(res => {
            this.globalMedicineList = res.data;
        });
    }

    getDWMYList(): void {
        this.dwmyDropdownList = this.dwmyService.getList();
        const dwmyValue = this.model && this.model.master && this.model.master.disposalDwmy ?
            this.dwmyDropdownList.find(model => model.id === this.model.master.disposalDwmy) :
            this.dwmyDropdownList.find(model => model.id === this.dwmyService.DAY);
        /*this.frmGroup.patchValue({
            disposalDwmy: dwmyValue ? dwmyValue : ''
        });*/
    }

    getTemplateList(): void {
        this.modelService.getTemplateList().subscribe(res => {
            this.templateDropdownList = res.data.map(m => ({
                ...m,
                name: m.master.templateName
            }));
        });
    }

    getDoctorInfo(): void {
        this.doctorInformationService.getByAppUserId(this.localStorageHelper.getUserInfo().id).subscribe(res => {
            this.doctorInformation = res.data;
        });
    }

    getTokenForCurrentDoctor(): void {
        this.tokenService.getByAppUserId(this.localStorageHelper.getUserInfo().id).subscribe(res => {
            this.tokenRegisterList = res.data;
            this.dataSource = new MatTableDataSource(this.tokenRegisterList);
        });
    }

    getInvestigationList(): void {
        this.ehmCommonLookupDetailsService.getListByMasterId(EHM_INVESTIGATION_ID).subscribe(res => {
            this.investigationDropdownList = res.data;
            if (this.model && this.model.master && this.model.investigationList.length > 0) {
                this.investigationRows.clear();
                this.model.investigationList.forEach(value => {
                    this.investigationAddRow(value);
                });
            }

            // finding
            if (this.model && this.model.master && this.model.investigationFindingList.length > 0) {
                this.investigationFindRows.clear();
                this.model.investigationFindingList.forEach(value => {
                    this.investigationFindAddRow(value);
                });
            }

        });
    }

    getCCList(): void {
        this.ehmCommonLookupDetailsService.getListByMasterId(EHM_CC_ID).subscribe(res => {
            this.ccDropdownList = this.menuType === TOKEN_REGISTER_DENTAL_ID ?
                res.data.filter((value, index) => value.shortCode.toLocaleLowerCase() === 'd') :
                res.data.filter((value, index) => value.shortCode.toLocaleLowerCase() !== 'd')
            ;
            if (this.model && this.model.master && this.model.ccList.length > 0) {
                this.ccRows.clear();
                this.model.ccList.forEach(value => {
                    this.ccAddRow(value);
                });
            }
        });
    }

    getFollowupComments(): void {
        this.ehmCommonLookupDetailsService.getListByMasterId(EHM_FOLLOWUP_COMMENT).subscribe(res => {
            this.followupCommentDropdownList = res.data;
        });
        this.getOnExamination();
    }
    getOnExamination(): void {
        this.ehmCommonLookupDetailsService.getListByMasterId(EHM_ON_EXAMINATION).subscribe(res => {
            this.onExaminationDropdownList = res.data;
            if (this.model && this.model.master && this.model.onExaminationList.length > 0) {
                this.onExaminationRows.clear();
                this.model.onExaminationList.forEach(value => {
                    this.onExaminationAddRow(value);
                });
            }
        });

    }

    getDiseaseList(): void {
        this.ehmCommonLookupDetailsService.getListByMasterId(EHM_DISEASE_ID).subscribe(res => {
            this.diseaseDropdownList = res.data;
            if (this.model && this.model.master && this.model.diseaseList.length > 0) {
                this.diseaseRows.clear();
                this.model.diseaseList.forEach(value => {
                    if (value.active === true) {
                        this.diseaseAddRow(value);
                    }
                });
            }
        });
    }

    getAdviceList(): void {
        this.ehmCommonLookupDetailsService.getListByMasterId(EHM_ADVICE_ID).subscribe(res => {
            // this.adviceDropdownList = res.data;
            this.adviceDropdownList = this.menuType === TOKEN_REGISTER_DENTAL_ID ?
                res.data.filter((value, index) => value.shortCode.toLocaleLowerCase() === 'd') :
                res.data.filter((value, index) => value.shortCode.toLocaleLowerCase() !== 'd')
            ;
            if (this.model && this.model.master && this.model.adviceList.length > 0) {
                this.adviceRows.clear();
                this.model.adviceList.forEach(value => {
                    this.adviceAddRow(value);
                });
            }
        });
    }

    getReferList(): void {
        this.ehmCommonLookupDetailsService.getListByMasterId(EHM_REF_DOC_ID).subscribe(res => {
            this.refDocDropdownList = res.data;
            if (this.model && this.model.master && this.model.master.referredDoctor) {
                this.refDocRows.clear();
                this.model.referredDoctorList.forEach(value => {
                    this.refDocAddRow(value);
                });
            }
        });
    }

    // getReferList(): void {
    //     this.ehmCommonLookupDetailsService.getListByMasterId(EHM_REF_DOC_ID).subscribe(res => {
    //         this.refDocDropdownList = this.menuType === TOKEN_REGISTER_DENTAL_ID ?
    //             res.data.filter((value, index) => value.shortCode.toLocaleLowerCase() === 'd') :
    //             res.data.filter((value, index) => value.shortCode.toLocaleLowerCase() !== 'd');
    //         if (this.model && this.model.master) {
    //             const selectValue = this.refDocDropdownList.find(model => model.id = this.model.master.referredDoctorId);
    //             this.frmGroup.patchValue({
    //                 referredDoctor: selectValue ? selectValue : ''
    //             });
    //         }
    //     });
    // }

    getDisposalList(): void {
        this.ehmCommonLookupDetailsService.getListByMasterId(EHM_DISPOSAL_ID).subscribe(res => {
            this.disposalDropdownList = this.menuType === TOKEN_REGISTER_DENTAL_ID ?
                res.data.filter((value, index) => value.shortCode.toLocaleLowerCase() === 'd') :
                res.data.filter((value, index) => value.shortCode.toLocaleLowerCase() !== 'd');
            if (this.model && this.model.master && this.model.disposalList.length > 0) {
                this.disposalRows.clear();
                this.model.disposalList.forEach(value => {
                    this.disposalAddRow(value);
                });
            }
        });
    }

    getDoseList(): void {
        this.ehmCommonLookupDetailsService.getListByMasterId(EHM_DOSE_ID).subscribe(res => {
            this.doseDropdownList = res.data;
            this.getInstructionList();
        });
    }

    getInstructionList(): void {
        this.ehmCommonLookupDetailsService.getListByMasterId(EHM_INSTRUCTION_ID).subscribe(res => {
            this.instructionDropdownList = res.data;
            if (this.model && this.model.master && this.model.treatmentList.length > 0) {
                const treatmentList: PatientPrescriptionTreatment[] = this.model.treatmentList;
                this.medicineRows.clear();
                treatmentList.sort((a, b) => (a.serialNo > b.serialNo) ? 1 : ((b.serialNo > a.serialNo) ? -1 : 0));
                treatmentList.forEach((value, index) => {
                    this.medicineAddRow(value, index);
                });
            }
        });
    }

    getPastIllnessByPatientId(patId: number): void {
        this.illnessHistoryService.getByPatId(patId).subscribe(res => {
            if (res.data.length > 0) {
                this.pastIllRows.clear();
                res.data.forEach(value => {
                    this.pastIllAddRow(value);
                });
            }
        });
    }

    onSubmit(isTemplate?: boolean): void {
        if (!this.userRolePermission.insert) {
            this.appUtils.onFailYourPermision(1);
            return;
        }
        this.generateModel(true, isTemplate);
        console.log(this.model);
        this.searchLoader = true;
        this.modelService.create(this.model).subscribe(res => {
            this.searchLoader = false;
            this.appUtils.onServerSuccessResponse(res, isTemplate ? null : this.reloadPage.bind(this));
            if (isTemplate) {
                this.getTemplateList();
            } else {
                this.printReport(res.data.master);
            }
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
        console.log(this.model);
        this.searchLoader = true;
        this.modelService.update(this.model).subscribe(res => {
            this.searchLoader = false;
            this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
            this.printReport(res.data.master);
        }, error => {
            this.appUtils.onServerErrorResponse(error);
            this.searchLoader = false;
        });
    }


    // -----------------------------------------------------------------------------------------------------
    // @ view method
    // -----------------------------------------------------------------------------------------------------
    edit(res: PatientPrescriptionRequest): void {
        this.editValue = true;
        this.model = res;
        const tokenRegister = new TokenRegister();
        tokenRegister.id = res.master.tokenRegisterId;
        tokenRegister.patientInfo = res.master.patientInfo;
        tokenRegister.referToDoctorId = res.master.doctorInfo;
        tokenRegister.tokenNumber = res.master.tokenRegisterNo;
        this.selectTokenRegister(tokenRegister);

        this.frmGroup.patchValue({
            illness: res.master.illness,
            pulse: res.master.pulse,
            bp: res.master.bp,
            temp: res.master.temp,
            rr: res.master.rr,
            height: res.master.height,
            weight: res.master.weight,
            ofc: res.master.ofc,
            spo2: res.master.spo2,
            onExamination: res.master.onExamination,

            prescriptionDate: res.master.prescriptionDate,
            otherAdvice: res.master.otherAdvice,
            followUpVisitDuration: res.master.followUpVisitDuration,
            followUpVisitDate: res.master.followUpVisitDate,
            followUpComment: res.master.followUpComment,
            active: res.master.active,
        });
    }


    resetFromData(): void {
        this.setFormInitValue();
        this.editValue = false;

        this.pastIllRows.clear();
        this.pastIllAddRow();

        this.ccRows.clear();
        this.ccAddRow();

        this.investigationFindRows.clear();
        this.investigationFindAddRow();

        this.diseaseRows.clear();
        this.diseaseAddRow();

        this.investigationRows.clear();
        this.investigationAddRow();

        this.adviceRows.clear();
        this.adviceAddRow();

        this.refDocRows.clear();
        this.refDocAddRow();

        this.disposalRows.clear();
        this.disposalAddRow();

        this.medicineRows.clear();
        this.medicineAddRow(null, null, null, true);

        this.filterNamePrescription = '';
    }

    selectTokenRegister(tR: TokenRegister): void {
        if (!tR) {
            return;
        }
        this.tokenRegister = tR;
        this.patientInfo = this.tokenRegister.patientInfo;
        this.frmGroup.patchValue({
            contactNo: this.tokenRegister.patientInfo.contactNo,
            patientName: this.tokenRegister.patientInfo.patientName,
            age: this.tokenRegister.patientInfo.age,
            tokenRegister: this.tokenRegister,
            illness: this.tokenRegister.primaryProblem,
            pulse: this.tokenRegister.pulse,
            bp: this.tokenRegister.bp,
            temp: this.tokenRegister.temp,
            rr: this.tokenRegister.rr,
            height: this.tokenRegister.height,
            weight: this.tokenRegister.weight,
            ofc: this.tokenRegister.ofc,
            spo2: this.tokenRegister.spo2,
        });
        this.pastIllRows.clear();
        this.pastIllAddRow();
        this.getPastIllnessByPatientId(this.patientInfo.id);
        this.modelService.searchPatientId(this.patientInfo.id).subscribe(res => {
            this.modelList = [];
            this.modelList = res.data;
        });

    }


    /*pastIll*/
    pastIllDeleteRow(index): any {
        if (this.pastIllRows.length === 1) {
            return false;
        } else {
            this.pastIllRows.removeAt(index);
            this.pastIllUpdateView();
            return true;
        }
    }

    pastIllAddRow(value?: any): any {

        const illnessName = value ? this.diseaseDropdownList.find(model => model.id === value.illnessName.id) : null;
        const row = this.formBuilder.group({
            id: [value ? value.id : ''],
            illnessName: [illnessName ? illnessName : ''],
            disposal: [value ? value.disposal : '', ''],
        });
        this.pastIllRows.push(row);
        this.pastIllUpdateView();
    }

    pastIllUpdateView(): any {
        this.pastIllDataSourceDetails.next(this.pastIllRows.controls);
    }

    checkPastIll(row): void {
        const selectValue = row.value.illnessName;
        if (!selectValue) {
            return;
        }
        let count = 0;
        this.pastIllRows.getRawValue().forEach(e => {
            if (e.illnessName.id === selectValue.id) {
                count++;
            }
        });
        if (count > 1) {
            this.showDataTakenMessage(row, 'illnessName');
        }
    }


    /*investigation finding*/
    investigationFindDeleteRow(index): any {
        if (this.investigationFindRows.length === 1) {
            return false;
        } else {
            this.investigationFindRows.removeAt(index);
            this.investigationFindUpdateView();
            return true;
        }
    }

    investigationFindAddRow(value?: PatientPrescriptionInvestigationFinding): any {
        const investigation = value ? this.investigationDropdownList.find(model => model.id === value.investigation.id) : '';
        const row = this.formBuilder.group({
            id: [value ? value.id : ''],
            investigation: [investigation, ''],
            finding: [value ? value.finding : '', ''],
        });
        this.investigationFindRows.push(row);
        this.investigationFindUpdateView();
    }

    investigationFindUpdateView(): any {
        this.investigationFindDataSourceDetails.next(this.investigationFindRows.controls);
    }


    /*cc*/
    ccDeleteRow(index): any {
        if (this.ccRows.length === 1) {
            return false;
        } else {
            this.ccRows.removeAt(index);
            this.ccUpdateView();
            return true;
        }
    }

    ccAddRow(value?: PatientPrescriptionChiefComplaint): any {
        const dwmyValue = value && value.dwmy ?
            this.dwmyDropdownList.find(model => model.id === value.dwmy) :
            this.dwmyDropdownList.find(model => model.id === this.dwmyService.DAY);
        const row = this.formBuilder.group({
            id: [value ? value.id : ''],
            chiefComplaintValue: [value ? value.chiefComplaintValue : ''],
            duration: [value ? value.duration : '', ''],
            dwmy: [dwmyValue ? dwmyValue : '', ''],
        });
        this.ccRows.push(row);
        this.ccUpdateView();
    }

    ccUpdateView(): any {
        this.ccDataSourceDetails.next(this.ccRows.controls);
        /*const btnElement = document.getElementById('chief');
        btnElement.focus();*/
    }

    /*disease*/
    diseaseDeleteRow(index): any {
        if (this.diseaseRows.length === 1) {
            return false;
        } else {
            this.diseaseRows.removeAt(index);
            this.diseaseUpdateView();
            return true;
        }
    }

    diseaseAddRow(value?: PatientPrescriptionDisease): any {
        const disease = value ? this.diseaseDropdownList.find(model => model.id === value.disease.id) : '';
        const row = this.formBuilder.group({
            id: [value ? value.id : ''],
            disease: [disease, ''],
            onExamination: [value ? value.onExamination : '', ''],
        });
        this.diseaseRows.push(row);
        this.diseaseUpdateView();
    }

    diseaseUpdateView(): any {
        this.diseaseDataSourceDetails.next(this.diseaseRows.controls);
    }

    checkDisease(row): void {
        const selectValue = row.value.disease;
        if (!selectValue) {
            return;
        }
        let count = 0;
        this.diseaseRows.getRawValue().forEach(e => {
            if (e.disease.id === selectValue.id) {
                count++;
            }
        });
        if (count > 1) {
            this.showDataTakenMessage(row, 'disease');
        }
    }

    /*investigation*/
    investigationDeleteRow(index): any {
        if (this.investigationRows.length === 1) {
            return false;
        } else {
            this.investigationRows.removeAt(index);
            this.investigationUpdateView();
            return true;
        }
    }

    investigationAddRow(value?: PatientPrescriptionInvestigation): any {
        const investigation = value ? this.investigationDropdownList.find(model => model.id === value.investigation.id) : '';
        const row = this.formBuilder.group({
            id: [value ? value.id : ''],
            investigation: [investigation, ''],
        });
        this.investigationRows.push(row);
        this.investigationUpdateView();
    }

    investigationUpdateView(): any {
        this.investigationDataSourceDetails.next(this.investigationRows.controls);
    }

    checkInvestigation(row): void {
        const selectValue = row.value.investigation;
        if (!selectValue) {
            return;
        }
        let count = 0;
        this.investigationRows.getRawValue().forEach(e => {
            if (e.investigation.id === selectValue.id) {
                count++;
            }
        });
        if (count > 1) {
            this.showDataTakenMessage(row, 'investigation');
        }
    }


    /*advice*/
    adviceDeleteRow(index): any {
        if (this.adviceRows.length === 1) {
            return false;
        } else {
            this.adviceRows.removeAt(index);
            this.adviceUpdateView();
            return true;
        }
    }

    adviceAddRow(value?: PatientPrescriptionAdvice): any {
        const advice = value ? this.adviceDropdownList.find(model => model.id === value.advice.id) : '';
        const row = this.formBuilder.group({
            id: [value ? value.id : ''],
            advice: [advice, ''],
        });
        this.adviceRows.push(row);
        this.adviceUpdateView();
    }

    adviceUpdateView(): any {
        this.adviceDataSourceDetails.next(this.adviceRows.controls);
    }

    checkAdvice(row): void {
        const selectValue = row.value.advice;
        if (!selectValue) {
            return;
        }
        let count = 0;
        this.adviceRows.getRawValue().forEach(e => {
            if (e.advice.id === selectValue.id) {
                count++;
            }
        });
        if (count > 1) {
            this.showDataTakenMessage(row, 'advice');
        }
    }

    onExaminationAddRow(value?: OnExamination): any {
        const row = this.formBuilder.group({
            id: [value ? value.id : ''],
            onExamination: [value ? value.onExamination : ''],
        });
        this.onExaminationRows.push(row);
        this.onExaminationView();
    }

    onExaminationView(): any {
        this.onExaminationDataSourceDetails.next(this.onExaminationRows.controls);
    }

    onExamDeleteRow(index): any {
        if (this.onExaminationRows.length === 1) {
            return false;
        } else {
            this.onExaminationRows.removeAt(index);
            this.onExaminationView();
            return true;
        }
    }

    // referred doctor
    refDocDeleteRow(index): any {
        if (this.refDocRows.length === 1) {
            return false;
        } else {
            this.refDocRows.removeAt(index);
            this.refDocUpdateView();
            return true;
        }
    }

    refDocAddRow(value?: PatientPrescriptionReferredDoctor): any{
        const referredDoctor = value ? this.refDocDropdownList.find(model => model.id === value.referredDoctor.id) : '';
        const row = this.formBuilder.group({
            id: [value ? value.id : ''],
            referredDoctor: [referredDoctor, ''],
        });
        this.refDocRows.push(row);
        this.refDocUpdateView();
    }

    refDocUpdateView(): any {
        this.referredDoctorDataSourceDetails.next(this.refDocRows.controls);
    }

    checkReferredDoctor(row): void {
        const selectValue = row.value.referredDoctor;
        if (!selectValue) {
            return;
        }
        let count = 0;
        this.refDocRows.getRawValue().forEach(e => {
            if (e.referredDoctor.id === selectValue.id) {
                count++;
            }
        });
        if (count > 1) {
            this.showDataTakenMessage(row, 'referredDoctor');
        }
    }

    /*disposal*/
    disposalDeleteRow(index): any {
        if (this.disposalRows.length === 1) {
            return false;
        } else {
            this.disposalRows.removeAt(index);
            this.disposalUpdateView();
            return true;
        }
    }

    disposalAddRow(value?: PatientPrescriptionDisposal): any {
        const disposal = value ? this.disposalDropdownList.find(model => model.id === value.disposal.id) : '';
        const dwmyValue = value && value.disposalDwmy ?
            this.dwmyDropdownList.find(model => model.id === value.disposalDwmy) :
            this.dwmyDropdownList.find(model => model.id === this.dwmyService.DAY);
        const row = this.formBuilder.group({
            id: [value ? value.id : ''],
            disposal: disposal,
            disposalDuration: [value ? value.disposalDuration : ''],
            dwmy: [dwmyValue ? dwmyValue : '', ''],
            disposalDate: [value ? value.disposalDate : '']
        });
        this.disposalRows.push(row);
        this.disposalUpdateView();
    }

    disposalUpdateView(): any {
        this.disposalDataSourceDetails.next(this.disposalRows.controls);
    }

    checkDisposal(row): void {
        const selectValue = row.value.advice;
        if (!selectValue) {
            return;
        }
        let count = 0;
        this.adviceRows.getRawValue().forEach(e => {
            if (e.advice.id === selectValue.id) {
                count++;
            }
        });
        if (count > 1) {
            this.showDataTakenMessage(row, 'advice');
        }
    }

    /*medicine*/
    medicineDeleteRow(index): any {
        if (this.medicineRows.length === 1) {
            this.appUtils.detailsLastEntryDeleteMsg();
            return false;
        } else {
            this.medicineRows.removeAt(index);
            this.medicineUpdateView();
            return true;
        }
    }

    medicineAddRow(value?: PatientPrescriptionTreatment, index?, isPlus?, isFirstTime?): any {
        /*work for previous serial*/
        let serialNoValue = isFirstTime ? '1' : '';
        const arrayLength = this.medicineRows.length;
        if (arrayLength > 0 && isPlus) {
            const previousIndex = arrayLength - 1;
            const previousSerial = this.medicineRows.at(previousIndex).value.serialNo;
            if (previousSerial) {
                const newValue = Number(previousSerial) + 1;
                serialNoValue = newValue.toString();
            }
        }

        /*now add row*/
        const dwmyValue = value && value.dwmy ?
            this.dwmyDropdownList.find(model => model.id === value.dwmy) :
            this.dwmyDropdownList.find(model => model.id === this.dwmyService.DAY);
        const doseValue = value && value.dose ? this.doseDropdownList.find(model => model.id === value.dose.id) : '';
        const instructionValue = value && value.instruction ? this.instructionDropdownList.find(model => model.id === value.instruction.id) : '';
        serialNoValue = value && value.serialNo ? value.serialNo.toString() : serialNoValue;
        const selectMedicine = value ? this.globalMedicineList.find(m => m.id === value.medicineMaster.id ): '';
        const row = this.formBuilder.group({
            id: [value ? value.id : ''],
            serialNo: [serialNoValue, ''],
            medicineMaster: [selectMedicine, ''],
            dose: [doseValue, ''],
            duration: [value ? value.duration : '', ''],
            dwmy: [dwmyValue ? dwmyValue : '', ''],
            qty: [value ? value.qty : '', ''],
            instruction: [instructionValue, ''],
            continueIs: [value ? value.continueIs : false, ''],
        });
        this.medicineRows.push(row);
        this.medicineUpdateView();

        row.get('continueIs').valueChanges
            .subscribe(checkedValue => {
                console.log(checkedValue);
                if (checkedValue) {
                    row.patchValue({
                        duration: '30',
                        qty: ''
                    });
                    this.calculateQty(row);
                }
            });

    }


    medicineSetValue(value?: PatientPrescriptionTreatment, index?, isPlus?, isFirstTime?): any {
        /*work for previous serial*/
        let serialNoValue = isFirstTime ? '1' : '';

        /*now add row*/
        const dwmyValue = value && value.dwmy ?
            this.dwmyDropdownList.find(model => model.id === value.dwmy) :
            this.dwmyDropdownList.find(model => model.id === this.dwmyService.DAY);
        const doseValue = value && value.dose ? this.doseDropdownList.find(model => model.id === value.dose.id) : '';
        const instructionValue = value && value.instruction ? this.instructionDropdownList.find(model => model.id === value.instruction.id) : '';
        serialNoValue = value && value.serialNo ? value.serialNo.toString() : serialNoValue;
        const selectMedicine = value ? this.globalMedicineList.find(m => m.id === value.medicineMaster.id ): '';

        const row = this.formBuilder.group({
            serialNo: [serialNoValue, ''],
            medicineMaster: [value ? selectMedicine : '', ''],
            dose: [doseValue, ''],
            duration: [value ? value.duration : '', ''],
            dwmy: [dwmyValue ? dwmyValue : '', ''],
            qty: [value ? value.qty : '', ''],
            instruction: [instructionValue, ''],
            continueIs: [value ? value.continueIs : false, ''],
        });
        this.medicineRows.push(row);
        this.medicineUpdateView();

    }

    medicineUpdateView(): any {
        this.medicineDataSourceDetails.next(this.medicineRows.controls);
    }

    checkMedicineMaster(row): void {
        const selectValue = row.value.medicineMaster;
        this.takenMedicine(selectValue);
        if (!selectValue) {
            return;
        }
        let count = 0;
        this.medicineRows.getRawValue().forEach(e => {
            if (e.medicineMaster.id === selectValue.id) {
                count++;
            }
        });
        if (count > 1) {
            this.showDataTakenMessage(row, 'medicineMaster');
        }
    }

    takenMedicine(ss: any): void {

        this.modelList.forEach(m => {
            m.treatmentList.forEach(n => {
                if (n.duration * n.dwmy >= this.dateCount(m.master.prescriptionDate) && ss.id === n.medicineMaster.id) {
                    this.openConfirmDialog(Math.round(this.dateCount(m.master.prescriptionDate)));
                }
            });
        });


    }

    isLocalActive(): boolean {
        return this.translate.currentLang !== this.langEn;
    }

    openConfirmDialog(num: number): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = ConfirmDialogConstant.WIDTH;
        dialogConfig.height = ConfirmDialogConstant.HEIGHT;
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {message: this.isLocalActive() ? 'রোগীকে ইতিমধ্যে ওষুধ দিয়েছেন ' + num + ' দিন আগে' : 'The Patient have given Medicine before ' + num + ' day ago'};
        const dialogRef = this.matDialog.open(SubmitConfirmationDialogComponent, dialogConfig);
        dialogRef.componentInstance.closeEventEmitter.subscribe(res => {
            dialogRef.close(true);
        });
    }




    dateCount(d: Date): any {

        const fromDate = new Date(this.appUtils.getCurrentDate());
        const toDate = new Date(d);
        // @ts-ignore
        return Math.abs(toDate - fromDate) / (1000 * 60 * 60 * 24);

    }


    /*onBlurVisitDuration(): void{
        const duration = this.frmGroup.value.followUpVisitDuration;
        let visitDate: Date = null;

        if (duration && duration > 0){
            visitDate = this.appUtils.getCurrentDate();
            visitDate.setDate( visitDate.getDate() + duration );
        }
        console.log('2 followUpVisitDate' + this.frmGroup.value.followUpVisitDate);
        console.log('2 disposalDate' + this.frmGroup.value.disposalDate);
        const disposalDate = this.frmGroup.value.disposalDate;
        console.log('found : ' + disposalDate);
        this.frmGroup.patchValue({
            followUpVisitDate: visitDate,
            disposalDate: disposalDate ? disposalDate : null
        });
        console.log('3 followUpVisitDate' + this.frmGroup.value.followUpVisitDate);
        console.log('3 disposalDate' + this.frmGroup.value.disposalDate);
    }*/

    onBlurDisposalDuration(row: any): void {
        let duration: number = row.value.disposalDuration;
        const disposalDwmy: DWMY = row.value.dwmy;
        console.log(duration);
        console.log(disposalDwmy);
        let disposalDate: Date = null;

        if (duration && duration > 0 && disposalDwmy) {
            duration = duration * disposalDwmy.id;
            disposalDate = this.appUtils.getCurrentDate();
            duration = duration - 1;
            disposalDate.setDate(disposalDate.getDate() + duration);
        }
        row.patchValue({
            disposalDate: disposalDate,
        });

        // console.log('3 followUpVisitDate' + this.frmGroup.value.followUpVisitDate);
        // console.log('3 disposalDate' + this.frmGroup.value.disposalDate);
    }

    calculateQty(row: any): void {
        const dose: CommonLookupDetails = row.value.dose;
        let duration = row.value.duration;
        const dwmy: DWMY = row.value.dwmy;
        let qty = 0;
        if (dose && duration && dwmy) {
            duration = duration * dwmy.id;
            qty = Number(dose.shortCode) > 0 && duration > 0 ? Number(dose.shortCode) * duration : 1;
        }
        row.patchValue({
            qty: qty
        });
    }

    onTemplateChange(): void {
        const template: PatientPrescriptionRequest = this.frmGroup.value.template;
        if (!template) {
            return;
        }
        this.frmGroup.patchValue({
            otherAdvice: template.master.otherAdvice,
        });
        if (template.treatmentList.length > 0) {
            this.medicineRows.clear();
            const treatmentList = template.treatmentList;
            treatmentList.sort((a, b) => (a.serialNo > b.serialNo) ? 1 : ((b.serialNo > a.serialNo) ? -1 : 0));
            treatmentList.forEach((value, index) => {
                this.medicineSetValue(value, index);
            });
        }

        if (template.investigationList.length > 0) {
            this.investigationRows.clear();
            template.investigationList.forEach((value) => {
                this.investigationAddRow(value);
            });
        }

        if (template.adviceList.length > 0) {
            this.adviceRows.clear();
            template.adviceList.forEach((value) => {
                this.adviceAddRow(value);
            });
        }

    }

    onBlurPreviousPrescription(): void {
        const prescription: string = this.filterNamePrescription;
        if (!prescription) {
            return;
        }
        this.prescriptionScanLoader = true;
        this.modelService.getByPrescriptionNo(prescription).subscribe(res => {
            this.prescriptionScanLoader = false;
            if (res.data && res.data.length > 0) {
                const prescriptionRequest: PatientPrescriptionRequest = res.data[0];
                if (prescriptionRequest.treatmentList.length > 0) {
                    this.medicineRows.clear();
                    const treatmentList = prescriptionRequest.treatmentList;
                    treatmentList.sort((a, b) => (a.serialNo > b.serialNo) ? 1 : ((b.serialNo > a.serialNo) ? -1 : 0));
                    treatmentList.forEach((value, index) => {
                        this.medicineAddRow(value, index);
                    });
                }
            } else {
                // this.reloadPage();
            }
        }, error => {
            this.appUtils.onServerErrorResponse(error);
            this.prescriptionScanLoader = false;
        });

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------

    setFormInitValue(): void {
        this.tokenRegister = null;
        this.patientInfo = null;
        this.frmGroup = this.formBuilder.group({
            template: ['', ''],
            contactNo: ['', ''],
            patientName: ['', ''],
            age: ['', ''],
            tokenRegister: ['', Validators.required],
            illness: ['', ''],
            pulse: ['', ''],
            bp: ['', ''],
            temp: ['', ''],
            rr: ['', ''],
            height: ['', ''],
            weight: ['', ''],
            ofc: ['', ''],
            spo2: ['', ''],
            onExamination: ['', ''],

            prescriptionDate: [this.appUtils.getCurrentDate(), ''],
            otherAdvice: ['', ''],
            // disposalName: ['', ''],
            referredDoctor: ['', ''],
            patientInfo: [''],
            // disposalDwmy: ['', ''],
            // disposalDate: ['', ''],
            followUpVisitDuration: ['', ''],
            followUpVisitDate: ['', ''],
            followUpComment: ['', ''],
            templateName: ['', ''],
            active: [true, ''],
        });
    }

    generateModel(isCreate: boolean, isTemplate?: boolean): void {
        if (isCreate) {
            this.model = new PatientPrescriptionRequest();
            this.model.master = new PatientPrescriptionMaster();
            this.model.master.id = undefined;
        }

        this.model.master.templateIs = isTemplate;
        this.model.master.templateName = isTemplate ? this.frmGroup.value.templateName : '';
        this.model.master.hosType = this.menuType;

        if (!isTemplate) {
            this.model.master.employeeCode = this.menuType === TOKEN_REGISTER_EMERGENCY_ID ? this.userInfo.employeeCode : null;
            const tokenRegister: TokenRegister = this.frmGroup.value.tokenRegister;
            this.model.master.tokenRegisterId = tokenRegister.id;
            this.model.master.tokenRegisterNo = tokenRegister.tokenNumber;
            this.model.master.patientInfo = tokenRegister.patientInfo;
            this.model.master.doctorInfo = tokenRegister.referToDoctorId;
            this.model.master.illness = this.frmGroup.value.illness;
            this.model.master.pulse = this.frmGroup.value.pulse;
            this.model.master.bp = this.frmGroup.value.bp;
            this.model.master.temp = this.frmGroup.value.temp;
            this.model.master.rr = this.frmGroup.value.rr;
            this.model.master.height = this.frmGroup.value.height;
            this.model.master.weight = this.frmGroup.value.weight;
            this.model.master.ofc = this.frmGroup.value.ofc;
            this.model.master.spo2 = this.frmGroup.value.spo2;
            this.model.master.onExamination = this.frmGroup.value.onExamination;

            const today = new Date();
            const prescriptionDate: Date = new Date(this.frmGroup.value.prescriptionDate);
            prescriptionDate.setHours(today.getHours(), today.getMinutes(), today.getSeconds(), today.getMilliseconds());
            this.model.master.prescriptionDate = prescriptionDate;

            const refDoc: CommonLookupDetails = this.frmGroup.value.referredDoctor;
            this.model.master.referredDoctorId = refDoc ? refDoc.id : null;
            this.model.master.referredDoctor = refDoc ? refDoc.name : '';


            /* const disposal: CommonLookupDetails = this.frmGroup.value.disposalName;
             this.model.master.disposalId = disposal ? disposal.id : null;
             this.model.master.disposalName = disposal ? disposal.name : '';
             this.model.master.disposalDuration = this.frmGroup.value.disposalDuration;
             this.model.master.disposalDwmy = this.frmGroup.value.disposalDwmy ? this.frmGroup.value.disposalDwmy.id : 0;
             this.model.master.disposalDate = this.frmGroup.value.disposalDate;*/

            this.model.master.followUpVisitDuration = this.frmGroup.value.followUpVisitDuration;
            this.model.master.followUpComment = this.frmGroup.value.followUpComment;
            this.model.master.followUpVisitDate = this.frmGroup.value.followUpVisitDate;
        }

        this.model.master.otherAdvice = this.frmGroup.value.otherAdvice;
        this.model.master.active = this.frmGroup.value.active;


        if (!isTemplate) {
            // cc
            const ccList = [];
            this.ccRows.getRawValue().forEach(e => {
                if (e.chiefComplaintValue) {
                    e.dwmy = e.dwmy ? e.dwmy.id : 0;
                    ccList.push(e);
                }
            });
            this.model.ccList = ccList;


            // pastIll
            const pastIllList = [];
            this.pastIllRows.getRawValue().forEach(e => {
                if (e.illnessName) {
                    pastIllList.push(e);
                }
            });
            this.model.pastIllHistoryList = pastIllList;

            // disease
            const diseaseList = [];
            this.diseaseRows.getRawValue().forEach(e => {
                if (e.disease) {
                    e.diseaseValue = e.disease.name;
                    diseaseList.push(e);
                }
            });
            this.model.diseaseList = diseaseList;

            // investigation Finding
            const investigationFindingList = [];
            this.investigationFindRows.getRawValue().forEach(e => {
                if (e.investigation) {
                    e.investigationValue = e.investigation.name;
                    investigationFindingList.push(e);
                }
            });
            this.model.investigationFindingList = investigationFindingList;
        }

        // investigation
        const investigationList = [];
        this.investigationRows.getRawValue().forEach(e => {
            if (e.investigation) {
                e.investigationValue = e.investigation.name;
                investigationList.push(e);
            }
        });
        this.model.investigationList = investigationList;

        // advice
        const adviceList = [];
        this.adviceRows.getRawValue().forEach(e => {
            if (e.advice) {
                e.adviceValue = e.advice.name;
                adviceList.push(e);
            }
        });
        this.model.adviceList = adviceList;

        // referred doctor
        const refDocList = [];
        this.refDocRows.getRawValue().forEach(e => {
            if (e.referredDoctor) {
                e.refDocValue = e.referredDoctor.name;
                refDocList.push(e);
            }
        });
        this.model.referredDoctorList = refDocList;

        // disposal
        const disposalList = [];
        this.disposalRows.getRawValue().forEach(e => {
            if (e.disposal) {
                e.disposalName = e.disposal.name;
                disposalList.push(e);
            }
        });
        this.model.disposalList = disposalList;

        // On Examination
        const onExaminationList = [];
        this.onExaminationRows.getRawValue().forEach(e => {
            if (e.onExamination){
                onExaminationList.push(e);
            }
        });
        this.model.onExaminationList = onExaminationList;

        // medicine
        const treatmentList = [];
        this.medicineRows.getRawValue().forEach(e => {
            if (e.medicineMaster) {
                e.dose = e.dose ? e.dose : null;
                e.doseValue = e.dose ? e.dose.name : '';
                e.dwmy = e.dwmy ? e.dwmy.id : 0;
                e.instruction = e.instruction ? e.instruction : null;
                e.instructionValue = e.instruction ? e.instruction.name : '';
                treatmentList.push(e);
            }
        });
        this.model.treatmentList = treatmentList;

    }

    reloadPage(): void {
        this.getTokenForCurrentDoctor();
        this.resetFromData();
    }

    showDataTakenMessage(row, formControl): void {
        const dataTaken = this.appUtils.isLocalActive() ? DATA_TAKEN_BN : DATA_TAKEN;
        const ok = this.appUtils.isLocalActive() ? OK_BN : OK;
        this.snackbarHelper.openErrorSnackBarWithMessage(dataTaken, ok);
        row.patchValue({[formControl]: ''});
    }

    openPatientPrescriptionDialog(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '70%';
        dialogConfig.height = '80%';
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {
            flag: 1,
            patId: this.patientInfo.id,
        };
        const dialogRef = this.matDialog.open(PrescriptionHistoryDailogComponent, dialogConfig);
        dialogRef.componentInstance.callBackMethod.subscribe(value => {

        });
    }


   /* openPatientTokenDialog(res: TokenRegister): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '60%';
        dialogConfig.height = '80%';
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = res;
        console.log(dialogConfig);
        const dialogRef = this.matDialog.open(TokenRegisterInfoDailogComponent, dialogConfig);
        dialogRef.componentInstance.callBackMethod.subscribe(value => {

        });

    }*/


 /*   openTokenRegisterDialog(): void {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;
        dialogConfig.width = '80%';
        dialogConfig.height = '80%';
        dialogConfig.panelClass = ConfirmDialogConstant.PANEL_CLASS;
        dialogConfig.data = {
            menuType: this.menuType,
            referToDoctor: this.doctorInformation
        };
        console.log(dialogConfig);
        const dialogRef = this.matDialog.open(TokenRegisterDialogComponent, dialogConfig);
        dialogRef.componentInstance.callBackMethod.subscribe(value => {
            this.getTokenForCurrentDoctor();
            this.selectTokenRegister(value);
        });
    }*/


    /*call back*/

    setCommonLookupAddValue(obj: any): void {
        const row: FormGroup = obj.row;
        const value = obj.value;
        const searchType = obj.searchType;
        const index = obj.index;
        if (searchType === this.ehmUtils.illnessDialog) {
            this.diseaseDropdownList.push(value);
            const selectValue = this.diseaseDropdownList.find(model => model.id === value.id);
            row.patchValue({
                illnessName: selectValue ? selectValue : ''
            });
        } else if (searchType === this.ehmUtils.ccDialog) {
            this.ccDropdownList.push(value);
            const selectValue = this.ccDropdownList.find(model => model.id === value.id);
            row.patchValue({
                chiefComplaint: selectValue ? selectValue : ''
            });
        } else if (searchType === this.ehmUtils.investigationDialog) {
            this.investigationDropdownList.push(value);
            const selectValue = this.investigationDropdownList.find(model => model.id === value.id);
            row.patchValue({
                investigation: selectValue ? selectValue : ''
            });
        } else if (searchType === this.ehmUtils.diseaseDialog) {
            this.diseaseDropdownList.push(value);
            const selectValue = this.diseaseDropdownList.find(model => model.id === value.id);
            row.patchValue({
                disease: selectValue ? selectValue : ''
            });
        } else if (searchType === this.ehmUtils.doseDialog) {
            this.doseDropdownList.push(value);
            const selectValue = this.doseDropdownList.find(model => model.id === value.id);
            row.patchValue({
                dose: selectValue ? selectValue : ''
            });
        } else if (searchType === this.ehmUtils.instructionDialog) {
            this.instructionDropdownList.push(value);
            const selectValue = this.instructionDropdownList.find(model => model.id === value.id);
            row.patchValue({
                instruction: selectValue ? selectValue : ''
            });
        } else if (searchType === this.ehmUtils.adviceDialog) {
            this.adviceDropdownList.push(value);
            const selectValue = this.adviceDropdownList.find(model => model.id === value.id);
            row.patchValue({
                advice: selectValue ? selectValue : ''
            });
        } else if (searchType === this.ehmUtils.refDocDialog) {
            this.refDocDropdownList.push(value);
            const selectValue = this.refDocDropdownList.find(model => model.id === value.id);
            this.frmGroup.patchValue({
                referredDoctor: selectValue ? selectValue : ''
            });
        } else if (searchType === this.ehmUtils.disposalDialog) {
            this.disposalDropdownList.push(value);
            const selectValue = this.disposalDropdownList.find(model => model.id === value.id);
            row.patchValue({
                disposal: selectValue ? selectValue : ''
            });
        }

        else if (searchType === this.ehmUtils.medicineDialog) {

            this.globalMedicineList.push(value);
            const selectValue = this.globalMedicineList.find(model => model.id === value.id);
            row.patchValue({
                medicineMaster: selectValue ? selectValue : ''
            });
        }
    }

    printReport(master: PatientPrescriptionMaster): any {
        const moduleId = '8';
        const reportId = '1';
        const params = new Map<string, string>();
        params.set('P_PRES_ID', master.id.toString());
        params.set('id', reportId);
        params.set('P_MODULE_ID', moduleId);
        this.appUtils.printReport(params);
    }


    addItem(commonLookupId: number, searchValue: any): void {
        const model: CommonLookupDetails = new CommonLookupDetails();
        model.name = searchValue;
        model.banglaName = searchValue;
        const masterObj: CommonLookupMaster = new CommonLookupMaster();
        masterObj.id = commonLookupId;
        model.master = masterObj;
        model.parent = null;
        model.shortCode = this.isDental ? 'D' : '';
        model.active = true;
        this.ehmCommonLookupDetailsService.create(model).subscribe(res => {
            this.appUtils.onServerSuccessResponse(res, null);
            if(commonLookupId === this.ccId){
                this.getCCList();
            }
            else if(commonLookupId === this.folloupComId){
                this.getFollowupComments();
            }
            else if (commonLookupId === this.onExamId){
                this.getOnExamination();
            }
        }, error => {
            this.appUtils.onServerErrorResponse(error);
        });
    }

    tokenGenerate(): void{

        this.tokenRegisterModel.id = null;
        this.tokenRegisterModel.patientName = this.frmGroup.value.patientName;
        this.tokenRegisterModel.registrationDate = this.appUtils.getCurrentDate();
        this.tokenRegisterModel.age =  this.frmGroup.value.age;
        this.tokenRegisterModel.contactNo = this.frmGroup.value.contactNo;

        /* TokenId: res.TokenId,*/
        this.tokenRegisterModel.patientInfo = this.frmGroup.value.patientInfo ? this.frmGroup.value.patientInfo: null;
        this.tokenRegisterModel.visitDate = this.appUtils.getCurrentDate();
        this.tokenRegisterModel.referToDoctorName = this.doctorInformation ? this.doctorInformation.name : null;
        this.tokenRegisterModel.referToDoctorId = this.doctorInformation ? this.doctorInformation : null;

        console.log(this.tokenRegisterModel);
        this.tokenService.create(this.tokenRegisterModel).subscribe(res => {
            this.selectTokenRegister(res.data);
        });

    }

    getPatientContactNumber(): void{
        const date: string = this.frmGroup.value.contactNo;

        this.tokenService.getPatientPhoneNumber(date).subscribe(res =>{
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


}
