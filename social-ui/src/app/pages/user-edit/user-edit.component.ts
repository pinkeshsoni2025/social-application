import {Component, OnInit, inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {UploadService} from '../../services/upload.service';
import {GLOBAL} from '../../services/global';
import { Identity } from '../../models/api-response';

@Component({
    selector: 'user-edit',
    standalone:true,
    providers: [UserService, UploadService],
    imports:[ReactiveFormsModule],
     templateUrl: './user-edit.component.html'
})
export class UserEditComponent implements OnInit {
    private fb = inject(FormBuilder);
    public title: string;
    public user: Identity | null = null;
    public identity;
    public token;
    public url: string;
    public status!: string;
    userEditForm!: FormGroup;
    isLoading: boolean = false;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _uploadService: UploadService
    ) {
        this.title = 'Update My Account';
        this.user = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.identity = this.user;
        this.url = GLOBAL.url;
        this.userEditForm = this.fb.group({
            name: [this.user?.name, Validators.required],
            surname: [this.user?.surname, Validators.required],
            nick: [this.user?.nick, Validators.required],
            email: [this.user?.email, [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    ngOnInit() {
        console.log('[OK] Component: user-edit.');
    }
    

    onSubmit(): void {
    if (this.userEditForm.valid) {
      this.isLoading = true;
      

      const userData: User = {
          name: this.userEditForm.get('name')?.value,
          surname: this.userEditForm.get('surname')?.value,
          nick: this.userEditForm.get('nick')?.value,
          email: this.userEditForm.get('email')?.value,
          password: this.userEditForm.get('password')?.value,
          _id: '',
          role: '',
          image: '',
          gettoken: undefined
      };

      this._userService.updateUser({...userData, ...this.user}).subscribe(
            response => {
                if (response.user && response.user._id) {
                    this.status = 'success';
                    
                } else {
                    this.status = 'error';
                }
            },
            error => {
                console.log(<any>error);
            },
            () => {
          this.isLoading = false;

          this._uploadService
                        .makeFileRequest(this.url + 'upload-image-user/' + this.user?._id, [], this.filesToUpload, this.token || '', 'image')
                        .then((result:any) => {
                            //this.user?.image = result.user.image;
                            localStorage.setItem('identity', JSON.stringify(this.user));
                        });

        }
        );

    }
  }

    
    /*onSubmit() {
        this._userService.updateUser(this.user).subscribe(
            response => {
                if (!response.user) {
                    this.status = 'error';
                } else {
                    this.status = 'success';
                    localStorage.setItem('identity', JSON.stringify(this.user));
                    this.identity = this.user;
                    this._uploadService
                        .makeFileRequest(this.url + 'upload-image-user/' + this.user._id, [], this.filesToUpload, this.token, 'image')
                        .then((result: any) => {
                            this.user.image = result.user.image;
                            localStorage.setItem('identity', JSON.stringify(this.user));
                        });
                }
            },
            error => {
                var errorMessage = <any> error;
                console.log(errorMessage);
                if (errorMessage != null) {
                    this.status = 'error';
                }
            }
        );
    }*/

    public filesToUpload!: Array<File>;

    fileChangeEvent() {
        let fileInput = this.userEditForm.get('profile_photo')?.value
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }
}
