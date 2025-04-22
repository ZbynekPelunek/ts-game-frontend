import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { CharacterCreateService } from '../character-create/character-create.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isUserAuthenticated$: Observable<boolean>;
  private authListenerSubs!: Subscription;

  constructor(
    private authService: AuthService,
    private charCreateService: CharacterCreateService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isUserAuthenticated$ = this.authService.isAuthenticated$;
    console.log('HEADER isUserAuthenticated: ', this.isUserAuthenticated$);
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.snackBar.open('Log out successful.', '', { duration: 5000 });
        //this.router.navigate(['']);
      },
      error: (err) => {
        console.log('LOGOUT error: ', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.authListenerSubs.unsubscribe();
  }
}
