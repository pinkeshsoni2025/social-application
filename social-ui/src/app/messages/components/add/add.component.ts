import {Component, OnInit, DoCheck, inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {Message} from '../../../models/message';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {MessageService} from '../../../services/message.service';
import {Follow} from '../../../models/follow';
import {FollowService} from '../../../services/follow.service';
import {User} from '../../../models/user';
import {UserService} from '../../../services/user.service';
import {GLOBAL} from '../../../services/global';
import { Identity } from '@/app/models/api-response';

@Component({
    selector: 'add',
    standalone:true,
    providers: [FollowService, MessageService],
    imports:[ReactiveFormsModule],
    templateUrl: './add.component.html',
})
export class AddComponent implements OnInit {
    private fb = inject(FormBuilder);
    public title: string;
    public message: Message;
    public identity!:Identity | null ;
    public token;
    public url: string;
    public status!: string;
    public follows!:string;
    addMessage!: FormGroup;
    isLoading: boolean = false;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _followService: FollowService,
        private _messageService: MessageService,
        private _userService: UserService,
    ) {
        this.title = 'Send message';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.message = new Message('', '', '', '',  this.identity?._id || '', '');
        this.addMessage = this.fb.group({
            receiver: ['', Validators.required],
            text: ['', Validators.required],
        });
    }

    ngOnInit() {
        console.log('[OK] Component: add.');
        this.getMyFollows();
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

    

   /* onSubmit(form) {
        this._messageService.addMessage(this.token, this.message).subscribe(
            response => {
                if (response.message) {
                    this.status = 'success';
                    form.reset();
                }
            },
            error => {
                this.status = 'error';
                console.log(<any>error);
            }
        );
    }*/

    getMyFollows() {
        this._followService.getMyFollows(this.token).subscribe(
            response => {
                this.follows = response.follows;
            },
            error => {
                console.log(<any>error);
            }
        );
    }
}
