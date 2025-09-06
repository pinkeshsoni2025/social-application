import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {User} from '../../models/user';
import {Follow} from '../../models/follow';
import {UserService} from '../../services/user.service';
import {FollowService} from '../../services/follow.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import {GLOBAL} from '../../services/global';
import { Identity } from '../../models/api-response';

@Component({
    selector: 'followed',
    standalone:true,
    providers: [UserService, FollowService],
     templateUrl: './followed.component.html',
    
})

export class FollowedComponent implements OnInit {
    public title: string;
    public url: string;
    public identity: Identity |null ={};
    public token!: string |null;
    public page:number =0;
    public next_page:number =0;
    public prev_page:number=0;
    public total:number=0;
    public pages:number=0;
    public users: User[]= [];
    public follows:any;
    public status: string= '';
    public userPageId:number =0;
    public followed:any;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _followService: FollowService
    ) {
        this.title = 'Followers of';
        this.url = GLOBAL.url;
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();

    }

    ngOnInit() {
        console.log('[OK] Component: followed.');
        this.actualPage();
    }

    actualPage() {
        this._route.params.subscribe(params => {
            let user_id = params['id'];
            this.userPageId = user_id;

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

//            this.getFollows(user_id, page);
            this.getUser(user_id, page);
        });
    }

    getFollows(user_id: string | null, page:number) {
        this._followService.getFollowed(this.token, user_id, page).subscribe(
            ( response: { follows: any; total: number; pages: number; user_following: number; }) => {
                if (!response.follows) {
                    this.status = 'error';
                } else {
                    this.total = response.total;
                    this.followed = response.follows;
                    this.pages = response.pages;
                    this.follows = response.user_following;
//                    this.follows = response.users_following;
                    if (page > this.pages) {
                        this._router.navigate(['/gente', 1]);
                    }
                }
            },
            (error: any) => {
                var errorMessage = <any>error;
                console.log(errorMessage);
                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }

    public user!: User;

    getUser(userId: string , page: number) {
        this._userService.getUser(userId).subscribe(
            ( response: { user: User }) => {
                if (response.user) {
                    this.user = response.user;
                    this.getFollows(userId, page);
                } else {
                    this._router.navigate(['/home']);
                }
            },
            (error: any) => {
                var errorMessage = <any>error;
                console.log(errorMessage);
                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }

    public followUserOver!: number;

    mouseEnter(user_id: number) {
        this.followUserOver = user_id;
    }
    mouseLeave() {
        this.followUserOver = 0;
    }

    followUser(followed: string) {
        var follow = new Follow('', this.identity && this.identity?._id || '', followed);

        this._followService.addFollow(this.token, follow).subscribe(
            (response: { follow: any; }) => {
                if (!response.follow) {
                    this.status = 'error';
                } else {
                    this.status = 'success';
                    this.follows.push(followed);
                }
            },
            (error: any) => {
                var errorMessage = <any>error;
                console.log(errorMessage);
                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }

    unfollowUser(followed: any) {
        this._followService.deleteFollow(this.token || '', followed).subscribe(
            (_response: any) => {
                var search = this.follows.indexOf(followed);
                if (search != -1) {
                    this.follows.splice(search, 1);
                }
            },
            ( error: any) => {
                var errorMessage = <any>error;
                console.log(errorMessage);
                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }
}
function Component(arg0: { selector: string; templateUrl: string; providers: (typeof UserService | typeof FollowService)[]; imports: (typeof SidebarComponent)[]; }): (target: typeof FollowedComponent) => void | typeof FollowedComponent {
    throw new Error('Function not implemented.');
}

