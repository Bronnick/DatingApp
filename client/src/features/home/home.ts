import { Component, inject, Input, OnInit, signal } from '@angular/core';
import { Register } from '../account/register/register';
import { User } from '../../types/user';
import { AccountService } from '../../core/services/account-service';

@Component({
  imports: [Register],
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  protected registerMode = signal(false)
  protected accountService = inject(AccountService)
  protected currentUser = signal<User | null>(null)

  ngOnInit(): void {
    this.currentUser = this.accountService.currentUser
  }

  showRegister(value: boolean) {
    this.registerMode.set(value)
  }
}
