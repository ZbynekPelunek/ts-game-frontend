import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';

@Component({
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.css']
})
export class AuthFormComponent {
  isLoading = false;

  constructor(public authService: AuthService) { }

  onLogin(): void {
    this.authService.login();
  }
}
