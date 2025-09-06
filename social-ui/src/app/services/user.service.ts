import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../model/api-response';

import { Identity } from '../models/api-response';
import { Followed } from '../models/follow';
import { Router } from '@angular/router';
import { User } from '../models/user';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private isAuthenticated = signal<boolean>(false);
    private readonly http = inject(HttpClient);
    private readonly apiUrl = `${environment.apiUrl}`;

    public identity: Identity| null = {};
    private isLoggedInSubject = new BehaviorSubject<boolean>(false);
    isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();
    public token!: string | null;
    public stats!: string | null;
    private readonly router = inject(Router);

    private readonly TOKEN_KEY = 'secret';


    private readonly httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    constructor() {

        /*  const token = localStorage.getItem('secret');
          if (token) {
           this.isAuthenticated.set(true);
          }
 
          this.isLoggedInSubject.next(!!token);*/
    }


    signup(user: any, gettoken: string | null = null): Observable<any> {
        if (gettoken != null) {
            user.gettoken = gettoken;
        }

        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this.http.post(environment.apiUrl + 'login', params, { headers: headers });
    }

    getIdentity() {
        if (localStorage.getItem('identity') != null) {
            let identity = JSON.parse(localStorage.getItem('identity') || '');


            if (identity && identity?._id) {
                this.identity = identity;
            }
        }
        return this.identity
    }


    getCounter(userId: string | null = null): Observable<any> {
        const token = this.getToken();
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', `${token}`);


        if (userId != null) {
            return this.http.get(environment.apiUrl + 'counters/' + userId, { headers: headers });
        } else {
            return this.http.get(environment.apiUrl + 'counters', { headers: headers });
        }
    }

    updateUser(user: User): Observable<any> {
        let params = JSON.stringify(user);
        const token = this.getToken();
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', `${token}`);

        return this.http.put(environment.apiUrl + 'update-user/' + user._id, params, { headers: headers });
    }

    login(credentials: { email: string, password: string }): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${environment.apiUrl}/login`, credentials);
    }



    register(user: User): Observable<any> {
        let params = JSON.stringify(user);
        let headers = new HttpHeaders().set('Content-Type', 'application/json');

        return this.http.post<ApiResponse>(environment.apiUrl + 'register', params, { headers: headers });
    }


    logout(): void {
        this.clearToken();
        this.isLoggedInSubject.next(false);
        this.router.navigate(['/login']);
    }

    isUserAuthenticated(): boolean {
        this.isLoggedInSubject.next(true);
        return !!this.getToken();

    }

    updatePassword(currentPassword: string, newPassword: string): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(`${environment.apiUrl}/auth/update-password`, {
            currentPassword,
            newPassword
        });
    }

    getUsers(page: number | null = null): Observable<any> {
        const token = this.getToken();
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json');

        return this.http.get(environment.apiUrl + 'users/' + page, { headers: headers });
    }


    getUser(id: string): Observable<any> {
        const token = this.getToken();
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json');

        return this.http.get(environment.apiUrl + 'user/' + id, { headers: headers });
    }

    getToken(): string | null {
        return localStorage.getItem(this.TOKEN_KEY);
    }
    setToken(token: string): void {
        localStorage.setItem(this.TOKEN_KEY, token);
        this.isAuthenticated.set(true);
    }

    clearToken(): void {
        localStorage.removeItem(this.TOKEN_KEY);
        this.isAuthenticated.set(false);
    }

    getStats() {
        let stats: string | null = localStorage.getItem('stats');

        if (stats != "undefined") {
            this.stats = stats;
        }

        return this.stats;
    }
} 