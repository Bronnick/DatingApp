import { Component, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EditableMember, Member } from '../../../types/member';
import { DatePipe } from '@angular/common';
import { MemberService } from '../../../core/services/member-service';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';
import { AccountService } from '../../../core/services/account-service';

@Component({
  imports: [DatePipe, FormsModule],
  selector: 'app-member-profile',
  styleUrl: './member-profile.css',
  templateUrl: './member-profile.html',
})
export class MemberProfile implements OnInit, OnDestroy {
  @ViewChild('editForm') editForm?: NgForm
  @HostListener('window:beforeunload', ['$event']) notify($event:BeforeUnloadEvent) {
    if(this.editForm?.dirty) {
      $event.preventDefault()
    }
  }
  private accountService = inject(AccountService)
  protected memberService = inject(MemberService)
  private toast = inject(ToastService)

  
  protected editableMember: EditableMember = {
      displayName:  '',
      description:  '',
      city: '',
      country: '',
  }
  
  ngOnInit(): void {

    this.editableMember = {
      displayName: this.memberService.member()?.displayName || '',
      description: this.memberService.member()?.description || '',
      city: this.memberService.member()?.city || '',
      country: this.memberService.member()?.country || '',
    }

  }

  ngOnDestroy(): void {
    this.memberService.editMode.set(false)
  }

  updateProfile() {
    if(!this.memberService.member()) return
    const updatedMember = {...this.memberService.member(), ...this.editableMember}
    this.memberService.updateMember(this.editableMember).subscribe({
      next: () => {
        const currentUser = this.accountService.currentUser()
        if(currentUser && updatedMember.displayName !== currentUser.displayName) {
          currentUser.displayName = updatedMember.displayName
          const currentUserModified = {...currentUser}
          this.accountService.setCurrentUser(currentUserModified)
        }
        this.toast.success('Profile updated successfully')
        this.memberService.editMode.set(false)
        this.memberService.member.set(updatedMember as Member)
        this.editForm?.reset(updatedMember)
      }
    })

    
  }
}
