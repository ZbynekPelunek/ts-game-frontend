import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Request_Account_POST, Response_Account_POST } from '../../../../shared/src';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();
  private accountId: string;

  constructor(private router: Router, private http: HttpClient) { }

  getIsAuth(): boolean {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getAccountId(): string {
    return this.accountId;
  }

  signUp(): void {
    this.http.post<Response_Account_POST>(`${BACKEND_URL}/accounts`, <Request_Account_POST>{ username: 'test', email: 'test1@test.test', password: '123' }).subscribe({
      next: (response) => {
        console.log('signed up: ', response);
        if (response.success) {
          this.accountId = response.account.accountId;
        }
        this.isAuthenticated = true;
        this.authStatusListener.next(true);
        this.router.navigate(['ui/character-create']);
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
