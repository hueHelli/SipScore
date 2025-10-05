import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Subscription } from 'rxjs';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  userName: string | null = null;
  private subscription: Subscription | null = null;

  constructor(
    private userService: UserService,
    private httpService: HttpService
  ) {}

  logout() {
    this.httpService.logout().subscribe(() => {
      this.userService.clearUser();
      window.location.reload();
    });
  }

  ngOnInit(): void {
    this.subscription = this.userService.getUserName().subscribe((username) => {
      this.userName = username;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
