import {Component, OnInit, inject} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';

@Component({
    selector: 'register',
    standalone:true,
    imports: [CommonModule, ReactiveFormsModule],
    providers: [UserService],
    templateUrl: './register.component.html'
})
export class RegisterComponent implements OnInit {
    private fb = inject(FormBuilder);
    private userService= inject(UserService);
    public title: string;
    public user: User;
    public status!: string;
    registerForm!: FormGroup;
    isLoading: boolean = false;

    constructor(
        private _route: ActivatedRoute,
        private _router: Router
    ) {
        this.title = 'Register';
        this.user = new User("", "", "", "", "", "", "ROLE_USER", "");
        this.registerForm = this.fb.group({
            name: ['', Validators.required],
            surname: ['', Validators.required],
            nick: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    ngOnInit() {
        console.log('[OK] Component: register.');
    }

    onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;
      

      const userData: User = {
          name: this.registerForm.get('name')?.value,
          surname: this.registerForm.get('surname')?.value,
          nick: this.registerForm.get('nick')?.value,
          email: this.registerForm.get('email')?.value,
          password: this.registerForm.get('password')?.value,
          _id: '',
          role: '',
          image: '',
          gettoken: undefined
      };

      this.userService.register({...userData}).subscribe(
          (            response: { user: { _id: any; }; }) => {
                if (response.user && response.user._id) {
                    this.status = 'success';
                    
                } else {
                    this.status = 'error';
                }
            },
          (            error: any) => {
                console.log(<any>error);
            },
            () => {
          this.isLoading = false;
        }
        );

    }
  }

   /* onSubmit(form) {
        this.userService.register(this.user).subscribe(
            response => {
                if (response.user && response.user._id) {
                    this.status = 'success';
                    form.reset();
                } else {
                    this.status = 'error';
                }
            },
            error => {
                console.log(<any>error);
            }
        );
    } */
}
