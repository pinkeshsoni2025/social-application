import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from './global';
import { User } from '../models/user';

@Injectable()
export class FollowService {
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    addFollow(token: string | null, follow: any): Observable<any> {
        let params = JSON.stringify(follow);
        let headers = new HttpHeaders()
            .set('Content-Type', 'application/json')
            .set('Authorization', `${token}`);


        return this._http.post(this.url + 'follow', params, { headers: headers });
    }

    deleteFollow(token: string | null, id: string): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', `${token}`);

        return this._http.delete(this.url + 'follow/' + id, { headers: headers });
    }

    getFollowing(token: string | null, userId: string | null = null, page = 1): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', `${token}`);

        var url = this.url + 'following';
        if (userId != null) {
            url = this.url + 'following/' + userId + '/' + page;
        }
        return this._http.get(url, { headers: headers });
    }

    getFollowed(token: string | null, userId: string | null = null, page: number = 1): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', `${token}`);

        var url = this.url + 'followed';
        if (userId != null) {
            url = this.url + 'followed/' + userId + '/' + page;
        }
        return this._http.get(url, { headers: headers });
    }

    getMyFollows(token: string | null): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Authorization', `${token}`);

        return this._http.get(this.url + 'get-my-follows/true', { headers: headers });
    }
}
