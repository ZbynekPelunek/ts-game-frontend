import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs/internal/Observable';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, MatSnackBarModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Game';
  isUserAuthenticated$: Observable<boolean>;
  isCreatingCharacter = false;
  private authListenerSubs: Subscription;
  private charCreatingSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.isUserAuthenticated$ = this.authService.isAuthenticated$;
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
    this.charCreatingSub.unsubscribe();
  }
}

