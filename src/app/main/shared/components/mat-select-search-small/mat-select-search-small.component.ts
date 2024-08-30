import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ReplaySubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {IOption} from '../../model/option';
import {AppUtils} from '../../../core/utils/app.utils';
import { EhmUtils } from 'app/main/groups/system-admin/features/utils/ehm.utils';
import { EhmCommonLookupDetailsService } from 'app/main/groups/system-admin/service/ehm-common-lookup-details.service';
import { MedicineMasterService } from 'app/main/groups/system-admin/service/medicine-master.service';
import {CommonLookupDetails} from '../../../groups/system-admin/model/common-lookup-details';
import {CommonLookupMaster} from '../../../groups/system-admin/model/common-lookup-master';
import {MedicineMaster} from '../../../groups/system-admin/model/medicine-master';


@Component({
    selector: 'mat-select-search-small',
    templateUrl: './mat-select-search-small.component.html',
    styleUrls: ['./mat-select-search-small.component.scss']
})

export class MatSelectSearchSmallComponent implements OnInit, OnChanges, OnDestroy {

    @Input() formGroup: FormGroup;
    @Input() controlName: string;
    @Input() data: IOption[];
    @Input() isReadonly: boolean;
    @Input() showSelectOne: boolean = true;
    @Input() isSearch: boolean = false;
    @Output() selectionChange = new EventEmitter<any>();
    @Output() customKeyDown = new EventEmitter<any>();
    @Input() isDental: boolean;
    @Input() commonLookupId: number;
    @Output() callBackForAddData = new EventEmitter<any>();
    @Input() searchType: number;
    @Input() index: number;


    public matSelectSearch: FormControl = new FormControl();
    protected _onDestroy = new Subject<void>();
    filteredData: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    filterList: IOption[] = [];

    constructor(
        private ehmCommonLookupDetailsService: EhmCommonLookupDetailsService,
        private medicineMasterService: MedicineMasterService,
        private appUtils: AppUtils,
        private ehmUtils: EhmUtils,

    ){

    }

    ngOnInit(): void {
        this.filteredData.next(this.data.slice());
        this.matSelectSearch.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
            this.filterData();
        });
    }

    ngOnDestroy(): void {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    private filterData(): any {
        if (!this.data) { return; }
        let search = this.matSelectSearch.value;
        if (!search) {
            this.filteredData.next(this.data.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter
        this.filterList = this.data.filter(d => d.name.toString().toLowerCase().includes(search)
            // || (d.nameEn && d.nameEn.toString().toLowerCase().includes(search))
            // || (d.nameBn && d.nameBn.toString().toLowerCase().includes(search))
        );
        this.filteredData.next(
            this.filterList
        );
    }

    onSelectionChange(value: any): any {
        this.selectionChange.emit();
    }

    onKeyDown(value: Event): any {
        // let filterValue = (value.target as HTMLInputElement).value;
        // filterValue = filterValue.trim().toLowerCase();
        // console.log(value);
        this.customKeyDown.emit(value);
    }

    getValueForSelectionControl(): string | null {
        const selectedOption = this.data.find(option => option.id === this.formGroup.controls[this.controlName].value);
        return selectedOption && selectedOption.name;
    }

    ngOnChanges(): void {
        this.filteredData.next(this.data.slice());
        this.matSelectSearch.valueChanges.pipe(takeUntil(this._onDestroy)).subscribe(() => {
            this.filterData();
        });
    }

    onClickAdd(): void{
        console.log('in' + this.commonLookupId);
        const searchValue = this.matSelectSearch.value;
        if (!this.commonLookupId){
            console.log('retrun');
            return;
        }else if (this.commonLookupId === this.ehmUtils.medicineDialog){
            console.log('medi');
            this.submitMedicineData(searchValue);
        }else {
            console.log('other');
            this.submitCommonLookupData(searchValue);
        }

    }

    submitCommonLookupData(searchValue): void{
        const model: CommonLookupDetails = new CommonLookupDetails();
        model.name = searchValue;
        model.banglaName = searchValue;
        const masterObj: CommonLookupMaster = new CommonLookupMaster();
        masterObj.id = this.commonLookupId;
        model.master = masterObj;
        model.parent = null;
        model.active = true;
        this.ehmCommonLookupDetailsService.create(model).subscribe(res => {
            this.appUtils.onServerSuccessResponse(res, null);
            const obj = {
                row : this.formGroup,
                value: res.data,
                searchType: this.searchType,
            };
            this.callBackForAddData.emit(obj);
        }, error => {
            this.appUtils.onServerErrorResponse(error);
        });
    }

    submitMedicineData(searchValue): void{
        const model: MedicineMaster = new MedicineMaster();

        const medicineGroup: CommonLookupDetails = new CommonLookupDetails();
        medicineGroup.id = this.ehmUtils.mescGroupId;
        model.medicineGroup = medicineGroup;

        const unitMeasurement: CommonLookupDetails = new CommonLookupDetails();
        unitMeasurement.id = this.ehmUtils.unitId;
        model.unitMeasurement = unitMeasurement;

        model.name = searchValue;
        model.barcode = '';
        model.availableStock = 0;
        model.minimumStock = 0;
        model.warningStock = 0;
        model.minimumStockSub = 0;
        model.warningStockSub = 0;
        model.minimumStockEmergency = 0;
        model.warningStockEmergency = 0;
        model.medicineIs = true;
        model.active = true;

        this.medicineMasterService.create(model).subscribe(res => {
            this.appUtils.onServerSuccessResponse(res, null);
            const obj = {
                row : this.formGroup,
                value:  res.data,
                searchType: this.searchType,
                index: this.index,
            };
            this.callBackForAddData.emit(obj);
        }, error => {
            this.appUtils.onServerErrorResponse(error);
        });
    }





}
