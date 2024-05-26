import {Injectable} from '@angular/core';
import {OFFICER_ID, STAFF_ID, TECHNICAL_ID} from '../../../core/constants/type';

@Injectable({
    providedIn: 'root'
})
export class HrmTypeService {

    getList(): HrmType[]{
        const list = [];
        list.push(new HrmType(OFFICER_ID, 'Officer'));
        list.push(new HrmType(STAFF_ID, 'Stuff'));
        list.push(new HrmType(TECHNICAL_ID, 'Technical'));
        return list;
    }
}

export class HrmType {
    id: number;
    name: string;
    constructor(id, name ){
        this.id = id;
        this.name = name;
    }
}
