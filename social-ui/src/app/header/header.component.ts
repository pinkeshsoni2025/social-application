import { Component,  OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subscription } from 'rxjs';
import { UserService } from '../services/user.service';
import { Identity } from '../models/api-response';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements  OnDestroy {
token: string | null = null;
private authSubscription: Subscription | undefined;
isLoggedIn: boolean = false;
identity: Identity|null  = {};

  
constructor(
    private router: Router,
    private authService:AuthService,
    private userServer:UserService

  ) {
      this.authSubscription = this.authService.isLoggedIn$.subscribe(status => {
        this.isLoggedIn = status;
       }); 
       this.identity = this.userServer.getIdentity();
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  public goToRegister(){
    this.router.navigate(['/register']);
  }
}
