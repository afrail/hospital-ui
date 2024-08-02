import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EmpUnitService {

    public BOF_EMPLOYEE = 1;
    public JS_ARMY_UNIT = 2;
    public MS_ARMY = 3;
    public MODC_UNIT = 4;
    public IANE_UNIT = 5;
    public CNE_UNIT = 6;

    getUnitList(): EmpUnit[] {
        const list = [];
        list.push(new EmpUnit(this.BOF_EMPLOYEE, 'BOF'));
        list.push(new EmpUnit(this.MS_ARMY, 'MES'));
        list.push(new EmpUnit(this.MODC_UNIT, 'MODC'));
        list.push(new EmpUnit(this.IANE_UNIT, 'IA&E'));
        list.push(new EmpUnit(this.JS_ARMY_UNIT, 'FC'));
        list.push(new EmpUnit(this.CNE_UNIT, 'CNE'));
        return list;
    }
}

export class EmpUnit {
    id: number;
    name: string;

    constructor(id, name) {
        this.id = id;
        this.name = name;
    }
}
