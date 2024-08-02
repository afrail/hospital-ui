import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class DWMYService {

    public DAY = 1;
    public WEEK = 7;
    public MONTH = 30;
    public YEAR = 365;
    public Hour = 0;

    getList(): DWMY[] {
        const list = [];
        list.push(new DWMY(this.DAY, 'Day'));
        list.push(new DWMY(this.WEEK, 'Week'));
        list.push(new DWMY(this.MONTH, 'Month'));
        list.push(new DWMY(this.YEAR, 'Year'));
        list.push(new DWMY(this.Hour, 'Hour'));
        return list;
    }
}

export class DWMY {
    id: number;
    name: string;

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
