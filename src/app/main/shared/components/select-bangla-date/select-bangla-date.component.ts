import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import { FuseTranslationLoaderService } from 'app/main/core/services/translation-loader.service';
import { BanglaDate, BanglaDateService } from './mock-api/bangla-date';
import {locale as lngEnglish} from './i18n/en';
import {locale as lngBangla} from './i18n/bn';


@Component({
    selector: 'select-bangla-date',
    templateUrl: './select-bangla-date.component.html',
})
export class SelectBanglaDateComponent implements OnInit {

    @Input() formGroup: FormGroup;
    @Input() dayControlName: string;
    @Input() monthControlName: string;
    @Input() yearControlName: string;

    banglaDayList: BanglaDate[] = new Array<BanglaDate>();
    banglaMonthList: BanglaDate[] = new Array<BanglaDate>();
    banglaYearList: BanglaDate[] = new Array<BanglaDate>();

    constructor(
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private banglaDateService: BanglaDateService,
    ) {
        this.fuseTranslationLoaderService.loadTranslations(lngEnglish, lngBangla);
    }


    ngOnInit(): void {
        this.banglaDayList = this.banglaDateService.getDayList();
        this.banglaMonthList = this.banglaDateService.getMonthList();
        this.banglaYearList = this.banglaDateService.getYearList(new Date);
    }
}
