import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {TranslateService} from '@ngx-translate/core';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';
import {Sort} from '@angular/material/sort';
import {PageEvent} from '@angular/material/paginator';
import {MedicineMaster} from '../../model/medicine-master';
import {MedicineMasterService} from '../../service/medicine-master.service';
import {EhmCommonLookupDetailsService} from '../../service/ehm-common-lookup-details.service';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {ActivatedRoute} from '@angular/router';
import {DEFAULT_PAGE, DEFAULT_SIZE} from '../../../../core/constants/constant';
import {UserRolePermission} from '../../model/user-role-permission';
import { CommonLookupDetails } from '../../model/common-lookup-details';
import {SnackbarHelper} from '../../../../core/helper/snackbar.helper';
import {FuseTranslationLoaderService} from '../../../../core/services/translation-loader.service';
import {AppUtils} from '../../../../core/utils/app.utils';
import {StorageUtils} from '../../../../core/utils/storage.utils';
import {OK, OK_BN} from '../../../../core/constants/message';


@Component({
    selector: 'app-medicine-master',
    templateUrl: './medicine-master.component.html',
    styleUrls: ['./medicine-master.component.scss'],
    animations: [
        trigger('detailExpand', [
            state('collapsed', style({height: '0px', minHeight: '0'})),
            state('expanded', style({height: '*'})),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ],
})
export class MedicineMasterComponent implements OnInit {
    /*dialog property*/
    @Input() isDialog: boolean;
    @Output() dialogResponse = new EventEmitter<MedicineMaster>();

    /*property*/
    hosType: number;
    disableDelete: boolean;
    editValue: boolean;
    searchLoader: boolean = false;
    size: number = DEFAULT_SIZE;
    page: number = DEFAULT_PAGE;
    total: number;
    displayedColumns: string[] = ['medicineGroup', 'unitMeasurement', 'medicineName', 'status', 'action'];

    userRolePermission: UserRolePermission;

    // object
    frmGroup: FormGroup;
    model: MedicineMaster = new MedicineMaster();
    modelList: MedicineMaster[] = new Array<MedicineMaster>();
    dataSource = new MatTableDataSource(this.modelList);
    sortedData: MedicineMaster[] = new Array<MedicineMaster>();

    /*dropdown*/
    groupDropdownList: CommonLookupDetails[] = new Array<CommonLookupDetails>();
    umDropdownList: CommonLookupDetails[] = new Array<CommonLookupDetails>();

    // Expandable table element
    expandedElement: MedicineMaster | null;
    /*displayColumnsDetails = ['minimumStock' , 'warningStock' , 'availableStock' , 'minimumStockSub' , 'warningStockSub' ,
        'availableStockSub' , 'minimumStockEmergency' , 'warningStockEmergency' , 'availableStockEmergency' ];*/
    // -----------------------------------------------------------------------------------------------------
    // @ Init
    // -----------------------------------------------------------------------------------------------------
    constructor(
        private route: ActivatedRoute,
        private modelService: MedicineMasterService,
        private lookupDetailsService: EhmCommonLookupDetailsService,
        private formBuilder: FormBuilder,
        private translate: TranslateService,
        private snackbarHelper: SnackbarHelper,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private appUtils: AppUtils,
        private storageUtils: StorageUtils,
    ) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
        this.userRolePermission = this.appUtils.findUserRolePermission();
    }

    get codeField(): any {
        return this.frmGroup.get('barcode');
    }

    ngOnInit(): void {
        this.route.data.subscribe(data => {
            this.hosType = data.hosType;
        });
        this.setFormInitValue();
        this.getModelList();
        this.getPageableModelList();
        this.getGroupList();
        this.getUMList();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ API calling
    // -----------------------------------------------------------------------------------------------------

    getModelList(): void {
        this.modelService.getList().subscribe(res => {
            this.modelList = res.data;
        });
    }

    getPageableModelList(): void {
        this.modelService.getListWithPagination(this.page, this.size).subscribe(res => {
            this.dataSource = new MatTableDataSource(res.data.content);
            this.total = res.data.totalElements;
        });
    }

    getGroupList(): void {
        this.lookupDetailsService.getList().subscribe(res => {
            this.groupDropdownList = res.data;
        });
    }

    getUMList(): void {
         this.lookupDetailsService.getListByMasterId(101).subscribe(res => {
            this.umDropdownList = res.data;
        });
    }

    onSubmit(): void {
        if (this.isBarcodeUsed(this.frmGroup.value.barcode, true, 0)) {
            return;
        }
        this.generateModel(true);
        console.log(this.model);
        this.searchLoader = true;
        this.modelService.create(this.model).subscribe(res => {
            this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
            this.searchLoader = false;
            if (this.isDialog) {
                this.dialogResponse.emit(res.data);
            }
        }, error => {
            this.appUtils.onServerErrorResponse(error);
            this.searchLoader = false;
        });

    }

    update(): void {
        /* if (!this.userRolePermission.edit) {
             this.appUtils.onFailYourPermision(2);
             return;
         }*/
        /*if (this.isBarcodeUsed(this.frmGroup.value.barcode, false, this.model.id)){
            return;
        }*/
        this.generateModel(false);
        console.log(this.model);
        this.searchLoader = true;
        this.modelService.update(this.model).subscribe(res => {
            this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
            this.searchLoader = false;
        }, error => {
            this.appUtils.onServerErrorResponse(error);
            this.searchLoader = false;
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ view method

    delete(obj: MedicineMaster): void {
        /*if (!this.userRolePermission.delete) {
            this.appUtils.onFailYourPermision(3);
            return;
        }*/
        this.modelService.delete(obj).subscribe(res => {
            this.appUtils.onServerSuccessResponse(res, this.reloadPage.bind(this));
        }, error => {
            this.appUtils.onServerErrorResponse(error);
        });
    }

    // -----------------------------------------------------------------------------------------------------
    edit(res: MedicineMaster): void {
        const selectGroup = res.medicineGroup ? this.groupDropdownList.find(model => model.id === res.medicineGroup.id) : '';
        const selectUm = res.unitMeasurement ? this.umDropdownList.find(model => model.id === res.unitMeasurement.id) : '';
        this.disableDelete = true;
        this.editValue = true;
        this.model = res;
        this.frmGroup.patchValue({
            medicineGroup: selectGroup,
            unitMeasurement: selectUm,
            medicineName: res.name,
            barcode: res.barcode,
            minimumStock: res.minimumStock,
            warningStock: res.warningStock,
            availableStock: res.availableStock,
            availableStockSub: res.availableStockSub,
            minimumStockSub: res.minimumStockSub,
            warningStockSub: res.warningStockSub,
            minimumStockEmergency: res.minimumStockEmergency,
            warningStockEmergency: res.warningStockEmergency,
            minimumStockDental: res.minimumStockDental,
            warningStockDental: res.warningStockDental,
            medicineIs: res.medicineIs,
            active: res.active,
        });
    }

    applyFilter(event: Event): void {
        let filterValue = (event.target as HTMLInputElement).value;
        filterValue = filterValue.trim().toLowerCase();
        if (filterValue.length > 0) {
            this.filter(filterValue);
        } else {
            this.size = DEFAULT_SIZE;
            this.page = DEFAULT_PAGE;
            this.getPageableModelList();
        }
    }

    filter(filterValue: string): void {
        const list = [];
        this.modelList.forEach(e => {
            // const umValue = e.unitMeasurement ? e.unitMeasurement.name : '';
            if (
                e.medicineGroup.name.toLowerCase().includes(filterValue) ||
                // umValue.toLowerCase().includes(filterValue) ||
                e.name.toLowerCase().includes(filterValue)
            ) {
                list.push(e);
            }
        });
        this.size = list.length;
        this.page = list.length;
        this.dataSource = new MatTableDataSource(list);
        this.total = list.length;
    }

    sortData(sort: Sort): void {
        const data = this.dataSource.data.slice();
        if (!sort.active || sort.direction === '') {
            this.dataSource = new MatTableDataSource(data);
            return;
        }
        this.sortedData = data.sort((a, b) => {
            const isAsc = sort.direction === 'asc';
            switch (sort.active) {
                case 'medicineGroup':
                    return this.compare(a.medicineGroup.name, b.medicineGroup.name, isAsc);
                case 'medicineName':
                    return this.compare(a.name, b.name, isAsc);
                default:
                    return 0;
            }
        });
        this.dataSource = new MatTableDataSource(this.sortedData);
    }

    compare(a: number | string, b: number | string, isAsc: boolean): any {
        return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
    }

    onChangePage(event: PageEvent): void {
        this.size = +event.pageSize; // get the pageSize
        this.page = +event.pageIndex; // get the current page
        this.getPageableModelList();
    }

    resetFromData(): void {
        this.setFormInitValue();
        this.disableDelete = false;
        this.editValue = false;
    }

    openDialog(viewModel: MedicineMaster): void {
        this.appUtils.openConfirmDialog(viewModel, this.delete.bind(this));

    }

    // -----------------------------------------------------------------------------------------------------
    // @ Helper Method
    // -----------------------------------------------------------------------------------------------------

    setFormInitValue(): void {
        this.frmGroup = this.formBuilder.group({
            medicineGroup: ['', Validators.required],
            unitMeasurement: ['', ''],
            medicineName: ['', Validators.required],
            barcode: ['', [Validators.minLength(5)]],
            minimumStock: [''],
            warningStock: [''],
            availableStock: [''],
            availableStockSub: [''],
            minimumStockSub: [''],
            warningStockSub: [''],
            minimumStockEmergency: [''],
            warningStockEmergency: [''],
            minimumStockDental: [''],
            warningStockDental: [''],
            active: [true, ''],
            medicineIs: ['', ''],
        });
    }

    generateModel(isCreate: boolean): void {
        if (isCreate) {
            this.model.id = undefined;
        }
        this.model.medicineGroup = this.frmGroup.value.medicineGroup;
        this.model.unitMeasurement = this.frmGroup.value.unitMeasurement ? this.frmGroup.value.unitMeasurement : null;
        this.model.name = this.frmGroup.value.medicineName;
        this.model.barcode = this.frmGroup.value.barcode;
        this.model.availableStock = this.frmGroup.value.availableStock;
        this.model.minimumStock = this.frmGroup.value.minimumStock;
        this.model.warningStock = this.frmGroup.value.warningStock;
        this.model.availableStockSub = this.frmGroup.value.availableStockSub;
        this.model.minimumStockSub = this.frmGroup.value.minimumStockSub;
        this.model.warningStockSub = this.frmGroup.value.warningStockSub;
        this.model.minimumStockEmergency = this.frmGroup.value.minimumStockEmergency;
        this.model.warningStockEmergency = this.frmGroup.value.warningStockEmergency;
        this.model.minimumStockDental = this.frmGroup.value.minimumStockDental;
        this.model.warningStockDental = this.frmGroup.value.warningStockDental;
        this.model.medicineIs = this.frmGroup.value.medicineIs;
        this.model.hosType = this.hosType;
        this.model.active = this.frmGroup.value.active;
    }

    reloadPage(): void {
        this.resetFromData();
        this.getPageableModelList();
        this.getModelList();
    }

    isBarcodeUsed(barcode: string, isCreate: boolean, id: number): boolean {
        if (!barcode && barcode.length <= 4) {
            return;
        }
        for (const obj of this.modelList) {
            // check for update
            if (!isCreate && id === obj.id) {
                continue;
            }
            if (obj.barcode === barcode) {
                const message = this.appUtils.isLocalActive() ? 'বারকোড ইতিমধ্যে ব্যবহৃত !' : 'Barcode already used !';
                const okay = this.appUtils.isLocalActive() ? OK_BN : OK;
                this.snackbarHelper.openErrorSnackBarWithMessage(message, okay);
                return true;
            }
        }
        return false;
    }

}
