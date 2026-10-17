import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { MemberService } from '../../../core/services/member-service';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { filter, Observable } from 'rxjs';
import { Member } from '../../../types/member';
import { AgePipe } from '../../../core/pipes/age-pipe';
import { AccountService } from '../../../core/services/account-service';
import { PresenceService } from '../../../core/services/presence-service';
import { LikesService } from '../../../core/services/likes-service';

@Component({
  imports: [RouterLink, RouterLinkActive, RouterOutlet, AgePipe],
  selector: 'app-member-detailed',
  styleUrl: './member-detailed.css',
  templateUrl: './member-detailed.html',
})
export class MemberDetailed implements OnInit{
  protected memberService = inject(MemberService)
  private accountService = inject(AccountService)
  protected presenceService = inject(PresenceService)
  protected likesService = inject(LikesService)
  private route = inject(ActivatedRoute)
  protected router = inject(Router)
  protected title = signal<string | undefined>('Profile')
  protected routeId = signal<string | null>(null)
  protected isCurrentUser = computed(() => {
    return this.accountService.currentUser()?.id === this.routeId()
  })
  protected hasLiked = computed(() => {
    return this.likesService.likeIds().includes(this.routeId()!)
  })

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.routeId.set(params.get('id'))
    })
  }

  ngOnInit(): void {
    this.title.set(this.route.firstChild?.snapshot?.title)

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe({
      next: () => {
        this.title.set(this.route.firstChild?.snapshot?.title)
      }
    })
  }

  
}
