import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AppUser} from '../../../system-admin/model/app-user';
import {UserRolePermission} from '../../../system-admin/model/user-role-permission';
import {AppUserService} from '../../../system-admin/service/app-user.service';
import {SnackbarHelper} from '../../../../core/helper/snackbar.helper';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {PasswordPolicyService} from '../../../system-admin/service/password-policy.service';
import {AppUtils} from '../../../../core/utils/app.utils';
import {locale as lngEnglish} from '../../../system-admin/features/app-user/i18n/en';
import {locale as lngBangla} from '../../../system-admin/features/app-user/i18n/bn';
import {PasswordPolicy} from '../../../system-admin/model/password-policy';


@Component({
    selector: 'settings-account',
    templateUrl: './account.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsAccountComponent implements OnInit {
    accountForm: FormGroup;

    model: AppUser = new AppUser();
    newModel: AppUser = new AppUser();
    userRolePermission: UserRolePermission;

    // dropdownList
    passwordPolicyDropdownList: PasswordPolicy[] = new Array<PasswordPolicy>();

    /**
     * Constructor
     */
    constructor(
        private _formBuilder: FormBuilder,
        private modelService: AppUserService,
        private snackbarHelper: SnackbarHelper,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private passwordPolicyService: PasswordPolicyService,
        private appUtils: AppUtils,
    ) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        // this.userRolePermission = this.appUtils.findUserRolePermission();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create the form
        // this.accountForm = this._formBuilder.group({
        //     name: ['Brian Hughes'],
        //     username: ['brianh'],
        //     title: ['Senior Frontend Developer'],
        //     company: ['YXZ Software'],
        //     about: ['Hey! This is Brian; husband, father and gamer. I\'m mostly passionate about bleeding edge tech and chocolate! 🍫'],
        //     email: ['hughes.brian@mail.com', Validators.email],
        //     phone: ['121-490-33-12'],
        //     country: ['usa'],
        //     language: ['english']
        // });
        this.setFormInitValue();
        this.getModel();
        this.getPasswordPolicyList();

    }

    getPasswordPolicyList(): any {
        this.passwordPolicyService.getActiveList().subscribe(res => {
            this.passwordPolicyDropdownList = res.data;
            const selectValue = this.model.passwordPolicy == null ? '' : this.passwordPolicyDropdownList.find(model => model.id === this.model.passwordPolicy.id);
            this.accountForm.patchValue({
                passwordPolicy: selectValue,
            });
        });
    }

    getModel(): any {
        this.modelService.getProfile().subscribe(res => {
            this.model = res.data;
            this.setValue(this.model);
            console.log(this.model);
        });
    }

    onSelectChange(): any {
        console.log(this.accountForm.value.passwordPolicy);
    }

    setFormInitValue(): any {
        this.accountForm = this._formBuilder.group({
            name: ['', Validators.required],
            username: ['', Validators.required],
            email: ['', Validators.email],
            mobile: ['', ''],
            designation: ['', Validators.required],
            passwordPolicy: ['', Validators.required],
            active: [true],
        });
    }

    setValue(data: AppUser): any {
        console.log(data.username);
        this.accountForm.patchValue({
            name: data.name,
            username: data.username,
            email: data.email,
            mobile: data.mobile,
            designation: data.designation,
            active: true,
        });
    }

    onSubmit(): any {
        this.generateModel();
        console.log(this.newModel);
        this.modelService.update(this.newModel).subscribe(res => {
            this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
        }, error => {
            this.appUtils.onServerErrorResponse(error);
        });
    }

    reloadPage(): void {
        this.resetFromData();
    }

    resetFromData(): any {
        this.setFormInitValue();
    }

    generateModel(): any {
        this.newModel.id = this.model.id;
        this.newModel.passwordPolicy = this.accountForm.value.passwordPolicy;
        this.newModel.username = this.accountForm.value.username;
        this.newModel.email = this.accountForm.value.email;
        this.newModel.mobile = this.accountForm.value.mobile;
        this.newModel.name = this.accountForm.value.name;
        this.newModel.designation = this.accountForm.value.designation;
        this.newModel.active = this.accountForm.value.active;
    }
}
