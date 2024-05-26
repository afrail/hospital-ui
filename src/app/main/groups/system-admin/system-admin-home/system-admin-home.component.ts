import {Component, OnInit} from '@angular/core';
import {AuthUtils} from 'app/main/core/auth/auth.utils';
import {CookieService} from 'ngx-cookie-service';

export interface Contract {
    Id: string;
    Name: string;
}


@Component({
    selector: 'app-system-admin-home',
    templateUrl: './system-admin-home.component.html',
    styleUrls: ['./system-admin-home.component.scss']
})

export class SystemAdminHomeComponent implements OnInit {

    appAccess = [];

    constructor(private cookieService: CookieService) {
    }

    ngOnInit(): void {
        const decodedToken = AuthUtils._decodeToken(this.cookieService.get('access_token').toString());
        this.appAccess = decodedToken.appAccess;
    }


}
