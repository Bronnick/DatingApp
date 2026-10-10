import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../../core/services/likes-service';
import { LikeParams, Member, MemberParams } from '../../types/member';
import { MemberCard } from '../members/member-card/member-card';
import { PaginatedResult } from '../../types/pagination';
import { Paginator } from '../../shared/paginator/paginator';

@Component({
  imports: [MemberCard, Paginator],
  selector: 'app-lists',
  styleUrl: './lists.css',
  templateUrl: './lists.html',
})
export class Lists implements OnInit {
  private likesService = inject(LikesService)
  protected members = signal<PaginatedResult<Member> | null>(null)
  protected likeParams = new LikeParams()


  tabs = [
    {label: 'Liked', value: 'liked'},
    {label: 'LikedBy', value: 'likedBy'},
    {label: 'Mutual', value: 'mutual'},
  ]

  ngOnInit(): void {
    this.loadLikes()
  }

  setPredicate(predicate: string) {
    if(this.likeParams.predicate !== predicate) {
      this.likeParams.predicate = predicate
      this.loadLikes()
    }
  }

  loadLikes() {
    this.likesService.getLikes(this.likeParams).subscribe({
      next: members => this.members.set(members)
    })
  }

  onPageChange(event: {pageNumber: number, pageSize: number}) {
    this.likeParams.pageSize = event.pageSize
    this.likeParams.pageNumber = event.pageNumber
    this.loadLikes()
  }

  
}
