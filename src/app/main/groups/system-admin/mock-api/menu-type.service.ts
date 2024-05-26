import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MenuTypeService {

    public GROUP_ID = 1;
    public MODULE_ID = 2;
    public MENU_ID = 4;

    getList(): MenuType[]{
        const list = [];
        list.push(new MenuType(this.GROUP_ID, 'Group'));
        list.push(new MenuType(this.MODULE_ID, 'Module'));
        list.push(new MenuType(3, 'Menu Group'));
        list.push(new MenuType(this.MENU_ID, 'Menu'));
        // list.push(new MenuType(5, 'Report'));
        // list.push(new MenuType(6, 'Report Param'));
        return list;
    }
}

export class MenuType {
    id: number;
    name: string;
    constructor(id, name ){
        this.id = id;
        this.name = name;
    }
}
