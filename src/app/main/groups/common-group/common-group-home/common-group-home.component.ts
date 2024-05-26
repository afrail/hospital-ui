import {Component, OnInit} from '@angular/core';
import {AuthUtils} from 'app/main/core/auth/auth.utils';
import {CookieService} from 'ngx-cookie-service';

export interface Contract {
    Id: string;
    Name: string;
}


@Component({
    selector: 'app-common-group-home',
    templateUrl: './common-group-home.component.html',
    styleUrls: ['./common-group-home.component.scss']
})

export class CommonGroupHomeComponent implements OnInit {

    appAccess = [];

    constructor(private cookieService: CookieService) {
    }

    ngOnInit(): void {
        const decodedToken = AuthUtils._decodeToken(this.cookieService.get('access_token').toString());
        this.appAccess = decodedToken.appAccess;
    }


}
