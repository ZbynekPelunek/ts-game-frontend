import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'app-root',
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

