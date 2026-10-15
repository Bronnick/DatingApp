import { Component, computed, inject, input } from '@angular/core';
import { Member } from '../../../types/member';
import { RouterLink } from '@angular/router';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { LikesService } from '../../../core/services/likes-service';
import { Lists } from '../../lists/lists';
import { PresenceService } from '../../../core/services/presence-service';

@Component({
  imports: [RouterLink, AgePipe],
  selector: 'app-member-card',
  styleUrl: './member-card.css',
  templateUrl: './member-card.html',
})
export class MemberCard {
  private likesService = inject(LikesService)
  private presenceService = inject(PresenceService)
  member = input.required<Member>()
  protected hasLiked = computed(() => {
    return this.likesService.likeIds().includes(this.member().id)
  })
  protected isOnline = computed(() => {
    return this.presenceService.onlineUsers().includes(this.member().id)
  })

  toggleLike(event: Event) {
    event.stopPropagation()
    this.likesService.toggleLike(this.member().id).subscribe({
      next: () => {
        if(this.hasLiked()) {
          this.likesService.likeIds.update(likeIds => {
              return likeIds.filter(id => id !== this.member().id)
            }
          )
        } else {
          this.likesService.likeIds.update(likeIds => {
            return [...likeIds, this.member().id]
          })
        }
      }
    })
  }
}
