import {ReportMaster} from './../../model/report-master';
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {SnackbarHelper} from 'app/main/core/helper/snackbar.helper';
import {FuseTranslationLoaderService} from 'app/main/core/services/translation-loader.service';
import {AppUtils} from 'app/main/core/utils/app.utils';
import {ValidationMessage} from 'app/main/core/constants/validation.message';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {UserRolePermission} from '../../model/user-role-permission';
import {ReportMasterService} from '../../service/report-master.service';
import {ParameterMasterService} from '../../service/parameter-master.service';
import {ReportConfigure} from '../../model/report-configure';
import {ReportConfigureService} from '../../service/report-configure.service';
import {MenuItem} from '../../model/menu-item';
import {MenuItemService} from '../../service/menu-item.service';
import {MenuTypeService} from '../../mock-api/menu-type.service';
import {environment} from 'environments/environment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {DomSanitizer, SafeHtml, SafeResourceUrl} from '@angular/platform-browser';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {ReportWithParameter} from '../../model/report-with-parameter';
import {OK} from 'app/main/core/constants/message';
import {saveAs as importedSaveAs} from 'file-saver';
import { LocalStorageHelper } from 'app/main/core/helper/local-storage.helper';


@Component({
    selector: 'report-configure',
    templateUrl: './report-configure.component.html',
    styleUrls: ['./report-configure.component.scss']
})
export class ReportConfigureComponent implements OnInit {
    @ViewChild('pdfViewer') pdfViewer;

    SERVER_URL = environment.ibcs.baseApiEndPoint + environment.ibcs.apiEndPoint + environment.ibcs.moduleSystemAdmin + 'report-configure';
    GENERATE_REPORT_URL = this.SERVER_URL + '/generate-report';
    // userRolePermission: UserRolePermission;

    validationMsg: ValidationMessage = new ValidationMessage();

    // object
    frmGroup: FormGroup;
    model: ReportConfigure = new ReportConfigure();
    modelList: ReportConfigure[] = new Array<ReportConfigure>();
    dataSource = new MatTableDataSource(new Array<ReportConfigure>());

    // dropdown
    reportMasterList: ReportMaster[] = new Array<ReportMaster>();
    reportMasterDropdownList: ReportMaster[] = new Array<ReportMaster>();
    moduleList: MenuItem[] = new Array<MenuItem>();
    moduleDropdownList: MenuItem[] = new Array<MenuItem>();

    // loder
    searchLoader: boolean = false;

    // params
    htmlParamsBody: SafeHtml;
    reportWithParameterList: ReportWithParameter[] = new Array<ReportWithParameter>();

    // report format
    isPdfButton: boolean = true;
    isDownloadButton: boolean = false;

    // user veriable
    userId: number;

    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------

    constructor(
        private formBuilder: FormBuilder,
        private modelService: ReportConfigureService,
        private reportMasterService: ReportMasterService,
        private parameterMasterService: ParameterMasterService,
        private menuItemService: MenuItemService,
        private menuTypeService: MenuTypeService,
        private snackbarHelper: SnackbarHelper,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private appUtils: AppUtils,
        private http: HttpClient,
        public sanitizer: DomSanitizer,
        private matDialog: MatDialog,
        private localStorageHelper: LocalStorageHelper,
    ) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        // this.userRolePermission = this.appUtils.findUserRolePermission();
    }

    ngOnInit(): void {
        this.getUserId();
        this.setFormInitValue();
        this.getReportMasterList();
    }

    getUserId(): any {
        const userInfo  = this.localStorageHelper.getUserInfo();
        this.userId = userInfo.id;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ API calling
    // -----------------------------------------------------------------------------------------------------


    getReportMasterList(): void {
        this.reportMasterService.getAuthorizedReportList(this.userId).subscribe(res => {
            this.reportMasterList = res.data.map(m => ({
                ...m,
                name: m.reportTitle,
            }));
            this.reportMasterDropdownList = this.reportMasterList;


            this.menuItemService.getByItemType(this.menuTypeService.MODULE_ID).subscribe(res => {
                const allMenuItemList = res.data;

                const tempAuthorizedModule = [];
                this.reportMasterList.forEach(e => {
                    tempAuthorizedModule.push(e.module)
                });

                let authorizedModule = [];
                for (const r of tempAuthorizedModule) {
                    if (authorizedModule.length > 0) {
                        for (const e of authorizedModule) {
                            if (r.id == e.id) {
                                authorizedModule = authorizedModule.filter(value => value.id != e.id);
                            }
                        }
                    }
                    authorizedModule.push(r);
                }
                const authorizedMenuItem = [];
                allMenuItemList.forEach(menu => {
                    authorizedModule.forEach(module => {
                        if(menu.id == module.id){
                            authorizedMenuItem.push(menu);
                        }
                    });
                });
                this.moduleDropdownList = authorizedMenuItem;
                this.moduleList = authorizedMenuItem;
            });

        });
    }

    resetFromData(): void {
        this.setFormInitValue();
    }

    refresh(): void{
        //const reportId = this.frmGroup.value.reportMaster.id;
        //const moduleId = this.frmGroup.value.module.id;
        this.selectReportChange();
    }


    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------
    setFormInitValue(): void {
        this.frmGroup = this.formBuilder.group({
            reportFormat: ['pdf', Validators.required],
            reportMaster: ['', Validators.required],
            module: ['', Validators.required]
        });
    }

    generateModel(isCreate: boolean): void {
        if (isCreate) {
            this.model.id = undefined;
        }
        this.model.reportFormat = this.frmGroup.value.reportFormat;
        this.model.reportMaster = this.frmGroup.value.reportMaster;
        this.model.module = this.frmGroup.value.module;
    }

    reloadPage(): void {
        this.resetFromData();
    }


    selectReportFormateChange(): void {
        const reportFormat = this.frmGroup.value.reportFormat;
        console.log(reportFormat);
        if (reportFormat) {
            if (reportFormat === 'pdf') {
                this.isPdfButton = true;
                this.isDownloadButton = false;
            }
            if (reportFormat === 'xlsx') {
                this.isPdfButton = false;
                this.isDownloadButton = true;
            }
            if (reportFormat === 'rtf') {
                this.isPdfButton = false;
                this.isDownloadButton = true;
            }
        } else {
            this.isPdfButton = true;
            this.isDownloadButton = false;
        }
    }


    selectModuleChange(): void {
        this.reportMasterDropdownList = [];
        this.reportWithParameterList = [];
        const module = this.frmGroup.value.module === '' ? null : this.frmGroup.value.module;
        if (module) {
            for (const val of this.reportMasterList) {
                if (module.id === val.module.id && val.active) {
                    this.reportMasterDropdownList.push(val);
                } else {
                    this.frmGroup.patchValue({
                        reportMaster: ''
                    });
                }
            }

        } else {
            this.reportMasterDropdownList = this.reportMasterList;
        }

        this.generateComponent();

    }


    selectReportChange(): void {
        const id = this.frmGroup.value.reportMaster.id;
        if (id == null || id == '' || id == undefined) {
            this.reportWithParameterList = [];
            this.generateComponent();
        } else {
            this.http
                .get<any>(this.SERVER_URL + '/params/' + this.frmGroup.value.reportMaster.id)
                .subscribe(res => {
                    this.reportWithParameterList = res.data;
                    this.generateComponent();
                }, error => {
                    console.log(error);
                });
        }
    }

    generateComponent(): void {
        var html = '<div style="height: auto; width: 100%; margin-top: 5px;"><form>';
        if (this.reportWithParameterList.length > 0) {
            html += '<p style="padding-buttom: 5px; font-size: 20px;">Parameters:</p>';
            this.reportWithParameterList.forEach(e => {
                const required = e.required ? '<i style="color: red">*</i>' : '';
                if (e.parameterMaster.dataType.toUpperCase() === 'STRING') {
                    html += '<div style="height: auto; width: 30%; float: left; margin-right: 10px; padding-top: 20px; "><lebel style="margin-buttom: 2px;">' + e.parameterMaster.parameterTitle + '</lebel>' + required + '</br>'
                        + '<input type="text" id="' + e.parameterMaster.parameterName + '" name="' + e.parameterMaster.parameterName + '" value="" style="height: 45px; width: 100%; border: 1px solid; border-radius: 5px; padding: 10px; "></div>';
                }
                if (e.parameterMaster.dataType.toUpperCase() == 'INTEGER') {
                    html += '<div style="height: auto; width: 30%; float: left; margin-right: 10px; padding-top: 20px;"><lebel style="margin-buttom: 2px; ">' + e.parameterMaster.parameterTitle + '</lebel>' + required + '</br>'
                        + '<input type="number" min="0" id="' + e.parameterMaster.parameterName + '" name="' + e.parameterMaster.parameterName + '" value="" style="height: 45px; width: 100%; border: 1px solid; border-radius: 5px; padding: 10px; "></div>';
                }
                if (e.parameterMaster.dataType.toUpperCase() == 'DATE') {
                    html += '<div style="height: auto; width: 30%; float: left; margin-right: 10px; padding-top: 20px;"><lebel style="margin-buttom: 2px; ">' + e.parameterMaster.parameterTitle + '</lebel>' + required + '</br>'
                        + '<input type="date" id="' + e.parameterMaster.parameterName + '" name="' + e.parameterMaster.parameterName + '" value="" style="height: 45px; width: 100%; border: 1px solid; border-radius: 5px; padding: 10px; "></div>';
                }
                if (e.parameterMaster.dataType.toUpperCase() == 'LIST') {
                    html += '<div style="height: auto; width: 30%; float: left; margin-right: 10px; padding-top: 20px;"><lebel style="margin-buttom: 2px; ">' + e.parameterMaster.parameterTitle + '</lebel>' + required + '</br>'
                        + '<select data-dropdown id="' + e.parameterMaster.parameterName + '" name="' + e.parameterMaster.parameterName + '" style="height: 45px; width: 100%;  border: 1px solid; border-radius: 5px; padding: 10px; ">'
                        + '<option value="0">Select One</option>'
                        + e.dropdownListData
                        + '</select></div>';
                }
            });
        }
        html += '</form></div>';
        document.getElementById('htmlParamsBody').innerHTML = html;

        // custom dropdown and event
        const dropdowns = document.querySelectorAll('[data-dropdown]');
        if (dropdowns.length > 0) {
            dropdowns.forEach(dropdown => {
                console.log('dropdown.......');
                console.log(dropdown);
                this.createCustomDropdown(dropdown);
            });
        }
    }

    printReport(): any {
        let params = new Map<string, string>();
        params.set('id', this.frmGroup.value.reportMaster.id);
        params.set('P_MODULE_ID', this.frmGroup.value.module.id);
        params.set('reportFormat', 'pdf');
        console.log(this.frmGroup.value.reportMaster.id);
        console.log(this.frmGroup.value.module.id);
        let form = document.querySelector('form');
        if (this.reportWithParameterList.length > 0) {

            // validation
            if (this.isParameterValid(this.reportWithParameterList)) {
                this.snackbarHelper.openErrorSnackBarWithMessage('Please add value in required parameters', OK);
                return;
            }

            // set paeams value
            this.reportWithParameterList.forEach(e => {
                if (e.parameterMaster.dataType.toUpperCase() == 'LIST') {
                    params.set(e.parameterMaster.parameterName, (<HTMLFormElement> form.querySelector('[name="' + e.parameterMaster.parameterName + '"]')).value);
                }else{
                    params.set((<HTMLInputElement> document.getElementById(e.parameterMaster.parameterName)).name, (<HTMLInputElement> document.getElementById(e.parameterMaster.parameterName)).value);
                }
            });
        }

        // set params value to angular map
        const convMap = {};
        params.forEach((val: string, key: string) => {
            convMap[key] = val;
        });


        const fileName = this.frmGroup.value.reportMaster.name + '.pdf';
        // get file from server
        this.searchLoader = true;
        this.modelService.printReport(convMap).subscribe(blob => {
            this.searchLoader = false;
            window.open(window.URL.createObjectURL(blob));

        }, error => {
            this.searchLoader = false;
        });
    }

    downloadReport(): any {

        let params = new Map<string, string>();
        params.set('id', this.frmGroup.value.reportMaster.id);
        params.set('P_MODULE_ID', this.frmGroup.value.module.id);
        const reportFormate = this.frmGroup.value.reportFormat;
        if (reportFormate == 'rtf') {
            params.set('reportFormat', 'rtf');
        } else {
            params.set('reportFormat', 'xlsx');
        }

        let form = document.querySelector('form');
        if (this.reportWithParameterList.length > 0) {
            // validation
            if (this.isParameterValid(this.reportWithParameterList)) {
                this.snackbarHelper.openErrorSnackBarWithMessage('Please add value in required parameters', OK);
                return;
            }

            // set paeams value
            this.reportWithParameterList.forEach(e => {
                if (e.parameterMaster.dataType.toUpperCase() == 'LIST') {
                    params.set(e.parameterMaster.parameterName, (<HTMLFormElement> form.querySelector('[name="' + e.parameterMaster.parameterName + '"]')).value);
                }else{
                    params.set((<HTMLInputElement> document.getElementById(e.parameterMaster.parameterName)).name, (<HTMLInputElement> document.getElementById(e.parameterMaster.parameterName)).value);
                }
            });
        }

        // set params value to angular map
        const convMap = {};
        params.forEach((val: string, key: string) => {
            convMap[key] = val;
        });

        // get file from server
        if (params.get('reportFormat') == 'rtf') {
            this.modelService.downloadReport(convMap).subscribe(blob => importedSaveAs(blob, this.frmGroup.value.reportMaster.name + '.rtf'));

        } else {
            this.modelService.downloadReport(convMap).subscribe(blob => importedSaveAs(blob, this.frmGroup.value.reportMaster.name + '.xlsx'));
        }

    }

    isParameterValid(paramList: any): boolean {

        for (const param of paramList) {
            if (param.required) {
                const paramValue = (<HTMLInputElement> document.getElementById(param.parameterMaster.parameterName)).value;
                if (paramValue === '' || paramValue === '0' || paramValue == null) {
                    return true;
                }
            }
        }
        return false;
    }

    // Create custom dropdown
    createCustomDropdown(dropdown): any {
        const options = dropdown.querySelectorAll('option');
        const optionsArr = Array.prototype.slice.call(options);

        const customDropdown = document.createElement('div');
        customDropdown.classList.add('dropdown');
        customDropdown.style.position = 'relative';
        customDropdown.style.height = '45px';
        customDropdown.style.border = '1px solid';
        customDropdown.style.borderRadius = '5px';
        customDropdown.style.padding = '10px';
        dropdown.insertAdjacentElement('afterend', customDropdown);

        const selected = document.createElement('div');
        selected.classList.add('dropdown__selected');
        selected.textContent = optionsArr[0].textContent;
        customDropdown.appendChild(selected);

        const menu = document.createElement('div');
        menu.classList.add('dropdown__menu');
        menu.style.display = 'none';
        menu.style.position = 'absolute';
        menu.style.top = '100%';
        menu.style.marginTop = '-45px';
        menu.style.left = '0';
        menu.style.width = '100%';
        menu.style.height = 'auto';
        menu.style.border = '1px solid';
        menu.style.backgroundColor = '#fff';
        menu.style.zIndex = '5';
        customDropdown.appendChild(menu);
        selected.addEventListener('click',  () => {
            if (menu.offsetParent !== null) {
                menu.style.display = 'none';
            }else {
                menu.style.display = 'block';
                menu.querySelector('input').focus();
            }
        });

        const search = document.createElement('input');
        search.placeholder = 'Search...';
        search.type = 'text';
        search.classList.add('dropdown__menu_search');
        search.style.display = 'block';
        search.style.width = '100%';
        search.style.border = '0';
        search.style.borderBottom = '1px solid';
        search.style.padding = '5px';
        search.style.outline = '0';
        menu.appendChild(search);

        const menuItemsWrapper = document.createElement('div');
        menuItemsWrapper.classList.add('dropdown__menu_items');
        menuItemsWrapper.style.maxHeight = '210px';
        menuItemsWrapper.style.overflowY = 'auto';
        menu.appendChild(menuItemsWrapper);

        optionsArr.forEach(option => {
            const item = document.createElement('div');
            item.classList.add('dropdown__menu_item');
            item.style.padding = '2px';
            item.style.cursor = 'pointer';
            item.dataset.value = option.value;
            item.textContent = option.textContent;
            menuItemsWrapper.appendChild(item);

            item.addEventListener('click', () => {
                const value = item.dataset.value;
                const label = item.textContent;

                selected.textContent = label;
                dropdown.value = value;

                menu.style.display = 'none';
                menu.querySelector('input').value = '';
                menu.querySelectorAll('div').forEach(div => {
                    if (div.classList.contains('selected')) {
                        div.classList.remove('selected');
                    }
                    if (div.offsetParent === null) {
                        div.style.display = 'block';
                    }
                });
                item.classList.add('selected');
            });
        });

        menuItemsWrapper.querySelector('div').classList.add('selected');
        search.addEventListener('input', () => {
            const customOptions = menu.querySelectorAll('.dropdown__menu_items div');
            const value = search.value.toLowerCase();
            const filteredItems = optionsArr.filter(item => item.innerHTML.toLowerCase().includes(value));
            const indexesArr = filteredItems.map(item => optionsArr.indexOf(item));

            optionsArr.forEach(option => {
                if (!indexesArr.includes(optionsArr.indexOf(option))) {
                    (<HTMLDivElement> customOptions[optionsArr.indexOf(option)]).style.display = 'none';
                }else {
                    if ((<HTMLDivElement> customOptions[optionsArr.indexOf(option)]).offsetParent === null) {
                        (<HTMLDivElement> customOptions[optionsArr.indexOf(option)]).style.display = 'block';
                    }
                }
            });
        });
        document.addEventListener('click', this.closeIfClickedOutside.bind(customDropdown, menu));
        dropdown.style.display = 'none';
    }

    // Close dropdown if clicked outside dropdown element
    closeIfClickedOutside(menu, e): any {
        if (e.target.closest('.dropdown') === null && e.target !== this && menu.offsetParent !== null) {
            menu.style.display = 'none';
        }
    }

}

