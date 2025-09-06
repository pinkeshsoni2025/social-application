import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Identity } from '../../models/api-response';

interface UserLogin {
    email: string, password: string
};

@Component({
    selector: 'login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html'

})

export class LoginComponent implements OnInit {
    private userService = inject(UserService);
    public title: string;
    public user: User;
    public status!: string;
    public identity!: Identity;
    public token!: string;
    loginForm!: FormGroup;
    isLoading: boolean = false;

    constructor(
        private fb: FormBuilder,
        private _router: Router
    ) {
        this.title = 'Login';
        this.user = new User("", "", "", "", "", "", "ROLE_USER", "");
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    ngOnInit() {
        console.log('[OK] Component: login.');
    }

    onSubmit(): void {
        if (this.loginForm.valid) {
            this.isLoading = true;


            const credentials: UserLogin = {
                email: this.loginForm.get('email')?.value,
                password: this.loginForm.get('password')?.value
            };
            this.user = { ...this.user, ...credentials };

            this.userService.signup({ ...this.user, ...credentials }).subscribe({
                next: (response: { user: Identity; }) => {

                    this.identity = response.user;
                    if (!this.identity || !this.identity._id) {
                        this.status = 'error';
                    } else {
                        this.status = 'success';
                        localStorage.setItem('identity', JSON.stringify(this.identity));
                    }
                },
                error: (error: any) => {
                    this.isLoading = false;
                    console.log(<any>error);
                    var errorMessage = <any>error;
                    if (errorMessage != null) {
                        this.status = 'error';
                    }
                },
                complete: () => {
                    this.isLoading = false;
                    this.getToken();
                }
            });
        }
    }
    /* onSubmit() {
         this.userService.signup(this.user).subscribe(
             response => {
                 this.identity = response.user;
                 if (!this.identity || !this.identity._id) {
                     this.status = 'error';
                 } else {
                     this.status = 'success';
                     localStorage.setItem('identity', JSON.stringify(this.identity));
                     this.getToken();
                 }
             },
             error => {
                 console.log(<any> error);
                 var errorMessage = <any> error;
                 if (errorMessage != null) {
                     this.status = 'error';
                 }
             }
         );
     }*/

    getToken() {
        this.userService.signup(this.user,'true').subscribe({
            next: (response: { token: string; }) => {
                this.token = response.token;
                if (this.token.length <= 0) {
                    this.status = 'error';
                } else {
                    localStorage.setItem('secret', this.token);

                }
            },
            error: (error: any) => {
                console.log(<any>error);
                var errorMessage = <any>error;
                if (errorMessage != null) {
                    this.status = 'error';
                }
            },
            complete: () => {
                this.isLoading = false;
                this.getCounters();
            }
        });
    }

    getCounters() {
        this.userService.getCounter(this.identity._id).subscribe({
            next: (response: any) => {
                localStorage.setItem('stats', JSON.stringify(response));
                this.status = "success";

            },
            error: (error: any) => {
                console.log(<any>error);
            },
            complete: () => {
                this.isLoading = false;
                this._router.navigate(['/home']);
            }
        });
    }
}
