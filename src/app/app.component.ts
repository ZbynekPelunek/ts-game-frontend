import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

import { AuthService } from './auth/auth.service';
import { CharacterCreateService } from './character-create/character-create.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Game';
  userIsAuthenticated = false;
  isCreatingCharacter = false;
  private authListenerSubs: Subscription;
  private charCreatingSub: Subscription;

  constructor(private authService: AuthService, private charCreateService: CharacterCreateService) { }

  ngOnInit(): void {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSubs = this.authService.getAuthStatusListener().subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });
    this.charCreatingSub = this.charCreateService.charCreating$.subscribe(isCreating => {
      this.isCreatingCharacter = isCreating;
    })
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
    this.charCreatingSub.unsubscribe();
  }
}
