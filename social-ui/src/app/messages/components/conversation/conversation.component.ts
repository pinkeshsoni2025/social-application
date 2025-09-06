import {Component, OnInit, DoCheck,inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {Message} from '../../../models/message';
import {MessageService} from '../../../services/message.service';
import {Follow} from '../../../models/follow';
import {FollowService} from '../../../services/follow.service';
import {User} from '../../../models/user';
import {UserService} from '../../../services/user.service';
import {GLOBAL} from '../../../services/global';

@Component({
    selector: 'conversation',
    standalone:true,
    providers: [FollowService, MessageService],
    imports:[ReactiveFormsModule],
    templateUrl: './conversation.component.html',
})
export class ConversationComponent implements OnInit {
     private fb = inject(FormBuilder);
    public title: string;
    public identity;
    public token: string |null;
    public url: string;
    public status!: string;
    public messages!: Message[];
    public messagesEmmit!: Message[];
    public message:Message;
    public pages: number=0;
    public total: number=0;
    public page: number=0;
    public next_page: number=0;
    public prev_page: number=0;
    addMessage!: FormGroup;
    isLoading: boolean = false;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _followService: FollowService,
        private _messageService: MessageService,
        private _userService: UserService,
    ) {
        this.title = 'Messages and conversations';
        this.identity = this._userService.getIdentity();
        this.message = new Message('', '', '', '',  this.identity?._id || '', '');
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
         this.addMessage = this.fb.group({
            receiver: ['', Validators.required],
            text: ['', Validators.required],
        });
    }

    ngOnInit() {
        console.log('[OK] Component: conversation.');
        this.actualPage();
    }

    actualPage() {
        this._route.params.subscribe(params => {
            let page = +params['page'];

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

            this.page = page;
            console.log(this.page);

//            this.getMessages(this.token, this.page);
//            this.getEmmitMessages(this.token, this.page);
            
//            this._route.params.subscribe(
//                params => {
//                    let id = params['id'];
//                    this.getUser(id);
//                    this.getCounter(id);
//                }
//            );
            let userId = params['userId'];
            
            this.getConversation(this.token, userId, this.page);
            
            console.log(this.page);
        });
    }

    getMessages(token:string, page:number) {
        this._messageService.getMyMessages(token, page).subscribe(
            response => {
                if (!response.messages) {

                } else {
                    this.messages = response.messages;
                    this.total = response.total;
                    this.pages = response.pages;
                    console.log(this.messages);
                }
            },
            error => {
                console.log(<any>error);
            }
        );
    }

    getEmmitMessages(token:string, page:number) {
        this._messageService.getEmmitMessages(token, page).subscribe(
            response => {
                if (!response.messages) {

                } else {
                    this.messagesEmmit = response.messages;
                    this.total = response.total;
                    this.pages = response.pages;
                    console.log(this.messagesEmmit);
                }
            },
            error => {
                console.log(<any>error);
            }
        );
    }

    getConversation(token:string| null, userId:string, page:number) {
        this._messageService.getConversation(token||'', userId||'', page).subscribe(
            response => {
                if (!response.messages) {

                } else {
                    this.messages = response.messages;
                    this.total = response.total;
                    this.pages = response.pages;
                    console.log(this.messages);
                }
            },
            error => {
                console.log(<any>error);
            }
        );
    }

    onSubmit(): void {
    if (this.addMessage.valid) {
      this.isLoading = true;
      

      const message: {receiver:string,text:string} = {
        receiver: this.addMessage.get('receiver')?.value,
        text: this.addMessage.get('text')?.value
      };

      this._messageService.addMessage(this.token||'',{...this.message, ...message}).subscribe({
        next: (response) => {

            if (response.message) {
                    this.status = 'success';
                    
                }
        },
        error: (error) => {
          console.log(<any> error);
                var errorMessage = <any> error;
                if (errorMessage != null) {
                    this.status = 'error';
                }
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}
