import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'my-account',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    canActivate: [AuthGuard]
  },
  { path: 'gente', loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent), canActivate: [AuthGuard] },

  { path: 'gente/:page', loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent), canActivate: [AuthGuard] },
  { path: 'timeline', loadComponent: () => import('./pages/timeline/timeline.component').then(m => m.TimelineComponent), canActivate: [AuthGuard] },
  { path: 'perfil/:id', loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent), canActivate: [AuthGuard] },
  //{ path: 'siguiendo/:id/:page', loadComponent: () => import('./pages/following/following.component').then(m => m.FollowingComponent), canActivate: [AuthGuard] },
  //{ path: 'seguidores/:id/:page', loadComponent: () => import('./pages/followed/followed.component').then(m => m.FollowedComponent), canActivate: [AuthGuard] },
  {
    path: '**', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
    
  },
  { path: 'users', loadComponent: () => import('./pages/users/users.component').then(m => m.UsersComponent), canActivate: [AuthGuard] },
 { path: 'users-edit', loadComponent: () => import('./pages/user-edit/user-edit.component').then(m => m.UserEditComponent), canActivate: [AuthGuard] },
]; 