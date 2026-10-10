import { inject, Injectable, Service, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LikeParams, Member } from '../../types/member';
import { PaginatedResult } from '../../types/pagination';

@Injectable({
    providedIn: 'root'
})
export class LikesService {
    private baseUrl = environment.apiUrl
    private http = inject(HttpClient)
    likeIds = signal<string[]>([])

    toggleLike(targetMemberId: string) {
        return this.http.post(`${this.baseUrl}likes/${targetMemberId}`, {})
    }

    getLikes(likeParams: LikeParams) {
        return this.http.get<PaginatedResult<Member>>(this.baseUrl + 'likes?predicate=' + likeParams.predicate +
            '&pageNumber=' + likeParams.pageNumber + '&pageSize=' + likeParams.pageSize
        )
    }

    getLikeIds() {
        return this.http.get<string[]>(this.baseUrl + 'likes/list').subscribe({
            next: ids => {
                this.likeIds.set(ids)
            }
        })
    }

    clearLikeIds() {
        this.likeIds.set([])
    }
}

