import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

import { CharacterCreateService } from '../character-create/character-create.service';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private characterId = '1';

  constructor(private router: Router, private http: HttpClient, private charCreateService: CharacterCreateService) { }

  getIsAuth(): boolean {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getCharacterId() {
    return this.characterId;
  }

  signUp(): void {
    this.http.post(`${BACKEND_URL}/accounts`, { username: 'test', email: 'test1@test.test', password: '123' }).subscribe({
      next: (response) => {
        console.log('signed up: ', response);
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.charCreateService.setCharCreatingValue(true);
        this.router.navigate(['ui/character-create'])
      }
    })
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
