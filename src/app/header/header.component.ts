import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  combineLatest,
  filter,
  map,
  Observable,
  startWith,
  Subscription
} from 'rxjs';

import { AuthService } from '../auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  standalone: true,
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    RouterLink
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  isUserAuthenticated$: Observable<boolean>;
  hasCharacters$: Observable<boolean>;
  private authListenerSubs!: Subscription;
  logoLink$: Observable<'/ui/character-create' | '/ui/menu/character' | '/'>;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isUserAuthenticated$ = this.authService.isAuthenticated$;
    this.hasCharacters$ = this.authService.hasCharacters$;

    this.logoLink$ = combineLatest([
      this.isUserAuthenticated$,
      this.hasCharacters$,
      this.router.events.pipe(
        filter((e) => e instanceof NavigationEnd),
        map(() => this.router.url),
        startWith(this.router.url)
      )
    ]).pipe(
      map(([isAuth, hasChars, url]) => {
        // If we’re on character-create, stay there
        if (url.startsWith('/ui/character-create')) {
          return '/ui/character-create';
        }
        // Otherwise if fully authed + has chars, go to character page
        if (isAuth && hasChars) {
          return '/ui/menu/character';
        }
        // Fallback to starter page
        return '/';
      })
    );
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
