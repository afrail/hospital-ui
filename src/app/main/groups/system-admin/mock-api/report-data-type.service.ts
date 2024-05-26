import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ReportDataTypeService {

    getList(): ReportDataType[]{
        const list = [];
        list.push(new ReportDataType(1, 'Integer'));
        list.push(new ReportDataType(2, 'String'));
        list.push(new ReportDataType(3, 'Date'));
        list.push(new ReportDataType(4, 'List'));
        return list;
    }
}

export class ReportDataType {
    id: number;
    name: string;
    constructor(id, name ){
        this.id = id;
        this.name = name;
    }
}
