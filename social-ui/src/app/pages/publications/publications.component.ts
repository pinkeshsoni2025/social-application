import {Component, OnInit, Input} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Publication} from '../../models/publication';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {PublicationService} from '../../services/publication.service';
import { User } from '../../models/user';

@Component({
    selector: 'publications',
    standalone:true,
    providers: [UserService, PublicationService],
    templateUrl: './publications.component.html'

})
export class PublicationsComponent implements OnInit {
    public identity;
    public token:string|null='';
    public title: string;
    public url: string;
    public status: string='';
    public page:number=0;
    public total:number=0;
    public pages:number=0;
    public itemsPerPage:number=0;
    public publications!: Publication[];
    @Input() user_id!: string  ;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private publicationService: PublicationService
    ) {
        this.title = 'Posts';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.page = 1;
    }

    ngOnInit() {
        console.log('[OK] Component: publications.');
        this.getPublications(this.user_id, this.page);
    }

    getPublications(user_id:string , page:number=0, adding = false) {
        this.publicationService.getPublicationUser(this.token ||'', this.user_id, page).subscribe(
            response => {
                if (response.publications) {
                    this.total = response.total_items;
                    this.pages = response.pages;
                    this.itemsPerPage = response.item_per_page;
                    //this.itemsPerPage = response.items_per_page;
                    if (!adding) {
                        this.publications = response.publications;
                    } else {
                        var arrayA = this.publications;
                        var arrayB = response.publications;
                        this.publications = arrayA.concat(arrayB);
                       // $("html, body").animate({scrollTop: $('html').prop("scrollHeight")}, 500);
                    }
                    if (page > this.pages) {
                        //this._router.navigate(['/home']);
                    }
                } else {
                    this.status = 'error';
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

    public noMore = false;

    viewMore() {
        this.page += 1;
        if (this.page == this.pages) {
            this.noMore = true;
        }
        this.getPublications(this.user_id, this.page, true);
    }
}
