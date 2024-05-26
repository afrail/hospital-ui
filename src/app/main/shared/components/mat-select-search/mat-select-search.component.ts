import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {ReplaySubject, Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {IOption} from '../../model/option';

@Component({
    selector: 'mat-select-search',
    templateUrl: './mat-select-search.component.html',
    styleUrls: ['./mat-select-search.component.scss']
})

export class MatSelectSearchComponent implements OnInit, OnChanges, OnDestroy {

    @Input() formGroup: FormGroup;
    @Input() controlName: string;
    @Input() data: IOption[];
    @Input() isReadonly: boolean;
    @Input() showSelectOne: boolean = true;
    @Input() isSearch: boolean = false;
    @Output() selectionChange = new EventEmitter<any>();
    @Output() customKeyDown = new EventEmitter<any>();


    public matSelectSearch: FormControl = new FormControl();
    protected _onDestroy = new Subject<void>();
    filteredData: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

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
        this.filteredData.next(
            this.data.filter(d => d.name.toString().toLowerCase().includes(search)
                // || (d.nameEn && d.nameEn.toString().toLowerCase().includes(search))
                // || (d.nameBn && d.nameBn.toString().toLowerCase().includes(search))
                )
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

}
