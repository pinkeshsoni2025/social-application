import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {User} from '../../../models/user';
import {Follow} from '../../../models/follow';
import {UserService} from '../../../services/user.service';
import {FollowService} from '../../../services/follow.service';
import {GLOBAL} from '../../../services/global';
import { Identity } from '../../../models/api-response';

@Component({
    selector: 'users',
    standalone:true,
    providers: [UserService, FollowService],
    templateUrl: './users.component.html'
})
export class UsersComponent implements OnInit {
    public title: string;
    public url: string;

    public identity!:Identity|null;
    public token:string|null;
    public page:number =0;
    public next_page:number =0;
    public prev_page:number =0;
    public total:number =0;
    public pages:number =0;
    public users!: User[];
    public follows!:string[];
    public follow_me:number =0;
    public status!: string;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService
    ) {
        this.title = 'Conversations';
        this.url = GLOBAL.url;
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();

    }

    ngOnInit() {
        console.log('[OK] Component: users.');
        this.actualPage();
    }

    actualPage() {
        this._route.params.subscribe(params => {
            let page = +params['page'];
            this.page = page;
            
            if (!params['page']) {
                page = 1;
            }
            
            if (!page) {
                page = 1;
            } else {
                this.next_page = page + 1;
                this.prev_page = page - 1;
                
                if (this.prev_page <= 0) {
                    this.prev_page = 1;
                }
            }
            
            this.getUsers(page);
        });
    }

    getUsers(page:number) {
        this._userService.getUsers(page).subscribe(
            response => {
                if (!response.users) {
                    this.status = 'error';
                } else {
                    this.total = response.total;
                    this.users = response.users;
                    this.pages = response.pages;
                    this.follows = response.user_following;
                    this.follow_me = response.user_follow_me;
                    if (page > this.pages) {
                        this._router.navigate(['/gente', 1]);
                    }
                }
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);
                
                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }

    
    public followUserOver!: string| number;

    mouseEnter(user_id: string='') {
        this.followUserOver = user_id;
    }

    mouseLeave() {
        this.followUserOver = 0;
    }

    followUser(followed:string) {
        var follow = new Follow('', this.identity?._id ||'', followed);

        this._followService.addFollow(this.token, follow).subscribe(
            response => {
                if (!response.follow) {
                    this.status = 'error';
                } else {
                    this.status = 'success';
                    this.follows.push(followed);
                }
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);

                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }

    unfollowUser(followed:string) {
        this._followService.deleteFollow(this.token, followed).subscribe(
            response => {
                var search = this.follows.indexOf(followed);
                if (search != -1) {
                    this.follows.splice(search, 1);
                }
            },
            error => {
                var errorMessage = <any>error;
                console.log(errorMessage);

                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }
}
