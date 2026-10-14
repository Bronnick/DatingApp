import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AccountService } from '../../core/services/account-service';
import { PhotoManagement } from './photo-management/photo-management';
import { UserManagement } from './user-management/user-management';

@Component({
  imports: [PhotoManagement, UserManagement],
  selector: 'app-admin',
  styleUrl: './admin.css',
  templateUrl: './admin.html',
})
export class Admin {
  protected accountService = inject(AccountService)
  activeTab = 'photos'
  tabs = [
    {label: 'Photo moderation', value: 'photos'},
    {label: 'User management', value: 'roles' }
  ]

  setTab(tab: string) {
    this.activeTab = tab
  }
}
