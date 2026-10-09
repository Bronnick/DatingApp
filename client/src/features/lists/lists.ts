import { Component, inject, OnInit, signal } from '@angular/core';
import { LikesService } from '../../core/services/likes-service';
import { Member } from '../../types/member';
import { MemberCard } from '../members/member-card/member-card';

@Component({
  imports: [MemberCard],
  selector: 'app-lists',
  styleUrl: './lists.css',
  templateUrl: './lists.html',
})
export class Lists implements OnInit {
  private likesService = inject(LikesService)
  protected members = signal<Member[]>([])
  protected predicate = 'liked'

  tabs = [
    {label: 'Liked', value: 'liked'},
    {label: 'LikedBy', value: 'likedBy'},
    {label: 'Mutual', value: 'mutual'},
  ]

  ngOnInit(): void {
    this.loadLikes()
  }

  setPredicate(predicate: string) {
    if(this.predicate !== predicate) {
      this.predicate = predicate
      this.loadLikes()
    }
  }

  loadLikes() {
    this.likesService.getLikes(this.predicate).subscribe({
      next: members => this.members.set(members)
    })
  }

  
}
