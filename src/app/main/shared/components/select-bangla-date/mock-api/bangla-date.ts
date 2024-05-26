import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BanglaDateService {
    getDayList(): BanglaDate[]{
        const list = [];
        list.push(new BanglaDate('১', '১'));
        list.push(new BanglaDate('২', '২'));
        list.push(new BanglaDate('৩', '৩'));
        list.push(new BanglaDate('৪', '৪'));
        list.push(new BanglaDate('৫', '৫'));
        list.push(new BanglaDate('৬', '৬'));
        list.push(new BanglaDate('৭', '৭'));
        list.push(new BanglaDate('৮', '৮'));
        list.push(new BanglaDate('৯', '৯'));
        list.push(new BanglaDate('১০', '১০'));
        list.push(new BanglaDate('১১', '১১'));
        list.push(new BanglaDate('১২', '১২'));
        list.push(new BanglaDate('১৩', '১৩'));
        list.push(new BanglaDate('১৪', '১৪'));
        list.push(new BanglaDate('১৫', '১৫'));
        list.push(new BanglaDate('১৬', '১৬'));
        list.push(new BanglaDate('১৭', '১৭'));
        list.push(new BanglaDate('১৮', '১৮'));
        list.push(new BanglaDate('১৯', '১৯'));
        list.push(new BanglaDate('২০', '২০'));
        list.push(new BanglaDate('২১', '২১'));
        list.push(new BanglaDate('২২', '২২'));
        list.push(new BanglaDate('২৩', '২৩'));
        list.push(new BanglaDate('২৪', '২৪'));
        list.push(new BanglaDate('২৫', '২৫'));
        list.push(new BanglaDate('২৬', '২৬'));
        list.push(new BanglaDate('২৭', '২৭'));
        list.push(new BanglaDate('২৮', '২৮'));
        list.push(new BanglaDate('২৯', '২৯'));
        list.push(new BanglaDate('৩০', '৩০'));
        list.push(new BanglaDate('৩১', '৩১'));
        return list;
    }


    getMonthList(): BanglaDate[]{
        const list = [];
        list.push(new BanglaDate('বৈশাখ', 'বৈশাখ'));
        list.push(new BanglaDate('জ্যৈষ্ঠ', 'জ্যৈষ্ঠ'));
        list.push(new BanglaDate('আষাঢ়', 'আষাঢ়'));
        list.push(new BanglaDate('শ্রাবণ', 'শ্রাবণ'));
        list.push(new BanglaDate('ভাদ্র', 'ভাদ্র'));
        list.push(new BanglaDate('আশ্বিন', 'আশ্বিন'));
        list.push(new BanglaDate('কার্তিক', 'কার্তিক'));
        list.push(new BanglaDate('অগ্রহায়ণ', 'অগ্রহায়ণ'));
        list.push(new BanglaDate('পৌষ', 'পৌষ'));
        list.push(new BanglaDate('মাঘ', 'মাঘ'));
        list.push(new BanglaDate('ফাল্গুন', 'ফাল্গুন'));
        list.push(new BanglaDate('চৈত্র', 'চৈত্র'));
        return list;
    }

    getYearList(englishCurrentDate: Date): BanglaDate[]{
        const list: BanglaDate[] = [];

        // const
        const banglaNumber: string[] = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
        const englishNumber: string[] = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        const englishYearList: string[] = [];
        const banglaYearList: string[] = [];


        // create bangla year list in english formate
        const englishCurrentYear: string = englishCurrentDate.getFullYear().toString();
        const currentBanglaYear: number = Number(englishCurrentYear) - 593;

        // privious 10 years bangla english formate
        for(var i=10; i >= 1; i--){
            englishYearList.push((currentBanglaYear - i).toString());
        }
        // current year bangla english formate
        englishYearList.push(currentBanglaYear.toString());
        // next 10 years bangla english formate
        for(var i=1; i <= 10; i++){
            englishYearList.push((currentBanglaYear + i).toString());
        }

        // convert english to bangla list
        englishYearList.forEach(y => {
            // string to array
            const engYearArr = y.split('');
            let banYearArr: string[] = [];
            engYearArr.forEach(e => {
                for(var i=0; i <= 9; i++){
                   if(e == englishNumber[i]){
                        banYearArr.push(banglaNumber[i]);
                   }
                }
            });
            //array to string
            const banglaYear = banYearArr.join('');
            banglaYearList.push(banglaYear);
        });

        // push for obj response
        banglaYearList.forEach(value => {
            list.push(new BanglaDate(value, value));
        });

        return list;
    }

    getFullDate(day: string, month: string, year: string): string{
        let dayValue = '';
        let monthValue = '';
        let yearValue = '';
        if(day != undefined){
            dayValue = day;
        }
        if(month != undefined){
            monthValue = month;
        }
        if(year != undefined){
            yearValue = year;
        }
        return dayValue +' ' + monthValue + ' ' + yearValue;
    }

    getDay(date: string): string{
        let day = '';
        if(date){
            const dateArr =  date.split(' ');
            if(dateArr.length == 1 || dateArr.length == 2){
                const dayList = this.getDayList()
                dayList.forEach(e => {
                    if(e.id == dateArr[0]){
                        day = dateArr[0];
                    }
                });

            }

            if(dateArr.length == 3){
                day = dateArr[0];
            }

        }
        return day;
    }

    getMonth(date: string): string{
        let month = '';
        if(date){
            const dateArr =  date.split(' ');
            if(dateArr.length == 1){
                const monthList = this.getMonthList()
                monthList.forEach(e => {
                    if(e.id == dateArr[0]){
                        month = dateArr[0];
                    }
                });

            }

            if(dateArr.length == 2){
                const monthList = this.getMonthList()
                monthList.forEach(e => {
                    if(e.id == dateArr[0]){
                        month = dateArr[0];
                    }
                    if(e.id == dateArr[1]){
                        month = dateArr[1];
                    }
                });

            }

            if(dateArr.length == 3){
                month = dateArr[1];
            }
        }
        return month;
    }

    getYear(date: string): string{
        let year = '';
        if(date){
            const dateArr =  date.split(' ');
            if(dateArr.length == 1){
                const yearList = this.getYearList(new Date);
                yearList.forEach(e => {
                    if(e.id == dateArr[0]){
                        year = dateArr[0];
                    }
                });

            }

            if(dateArr.length == 2){
                const yearList = this.getYearList(new Date);
                yearList.forEach(e => {
                    if(e.id == dateArr[1]){
                        year = dateArr[1];
                    }
                });

            }

            if(dateArr.length == 3){
                year = dateArr[2];
            }
        }
        return year;
    }
}

export class BanglaDate {
    id: string;
    name: string;
    constructor(id, name ){
        this.id = id;
        this.name = name;
    }
}
