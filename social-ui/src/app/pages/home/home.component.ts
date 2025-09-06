import {Component, OnInit} from '@angular/core';
import {UserService} from '../../services/user.service';
import { Identity } from '../../models/api-response';

import { RouterLink } from '@angular/router';

@Component({
    selector: 'home',
    standalone:true,
    providers: [UserService],
    imports:[RouterLink],
     templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
    public title: string;
    public identity:Identity | null ={};
   

    constructor(
        private _userService: UserService
    ) {
        this.title = 'Welcome';
        this.identity = this._userService.getIdentity();
    }

    ngOnInit() {
        console.log('[OK] Component: home.');
        console.log('Social App Version: 0.3.0');
        
    }

    onSubmit() {
    }

   
}
