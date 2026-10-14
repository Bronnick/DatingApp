import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service, signal } from '@angular/core';
import { RegisterCreds, User } from '../../types/user';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes-service';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private http = inject(HttpClient);
    private likesService = inject(LikesService)
    currentUser = signal<User | null>(null)

    private baseUrl = environment.apiUrl

    register(creds: RegisterCreds) {
        return this.http.post<User>(this.baseUrl + 'account/register', creds, {withCredentials: true}).pipe(
            tap(user => {
                if(user){
                    this.setCurrentUser(user)
                    this.startTokenRefreshInterval()
                }
            })
        )
    }

    login(creds: any) {
        return this.http.post<User>(this.baseUrl + 'account/login', creds, {withCredentials: true}).pipe(
            tap(user => {
                if(user){
                    this.setCurrentUser(user)
                    this.startTokenRefreshInterval()
                }
            })
        )
    }

    refreshToken() {
        return this.http.post<User>(this.baseUrl + 'account/refresh-token', {}, {withCredentials: true})
    }

    startTokenRefreshInterval() {
        setInterval(() => {
            this.http.post<User>(this.baseUrl + 'account/refresh-token', {}, {withCredentials: true}).subscribe({
                next: user => {
                    this.setCurrentUser(user)
                },
                error: () => {
                    this.logout()
                }
            })
        }, 300000)
    }

    setCurrentUser(user: User) {
        user.roles = this.GetRolesFromToken(user)
        //this.currentUser.set(null)
        localStorage.removeItem('user')
        this.currentUser.set(user)
        this.likesService.getLikeIds()
    }

    logout() {
        localStorage.removeItem('filters')
        this.likesService.clearLikeIds()
        this.currentUser.set(null)
    }

    private GetRolesFromToken(user: User): string[] {
        const payload = user.token.split('.')[1]
        const decoded = atob(payload)

        const jsonPayload = JSON.parse(decoded)

        return Array.isArray(jsonPayload.role) ? jsonPayload.role : [jsonPayload.role]
    }
}
