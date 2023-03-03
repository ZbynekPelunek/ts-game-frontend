import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private characterId = '1';

  constructor(private router: Router) { }

  getIsAuth(): boolean {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getCharacterId() {
    return this.characterId;
  }

  login(): void {
    //console.log('LOGING IN');
    this.isAuthenticated = true;
    this.authStatusListener.next(true);
    this.router.navigate(['/ui/menu/character']);
  }

  logout(): void {
    //console.log('LOGING OUT');
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }
}
