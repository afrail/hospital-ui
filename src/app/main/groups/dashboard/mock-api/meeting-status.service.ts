import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MeetingStatusService {

    public INIT_ID = 'I';
    public OPEN_ID = 'O';
    public APPROVE_ID = 'A';
    public CLOSE_ID = 'C';

    getList(): MeetingStatus[]{
        const list = [];
        list.push(new MeetingStatus(this.INIT_ID, 'Initialize', 'gray'));
        list.push(new MeetingStatus(this.OPEN_ID, 'Invite', 'blue'));
        list.push(new MeetingStatus(this.APPROVE_ID, 'Approve', 'green'));
        list.push(new MeetingStatus(this.CLOSE_ID, 'Close', 'red'));
        return list;
    }
}

export class MeetingStatus {
    id: string;
    name: string;
    color: string;
    constructor(id, name, color ){
        this.id = id;
        this.name = name;
        this.color = color;
    }
}


