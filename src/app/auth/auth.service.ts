import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

import {
  ApiRoutes,
  AuthLoginRequestDTO,
  AuthLoginResponse,
  AuthStatusResponse,
  CreateAccountRequestDTO,
  CreateAccountResponse
} from '../../../../shared/src';
import { Router } from '@angular/router';
import { CharacterService } from '../sidenav/content/character/character.service';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private accountId: string;

  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  private http = inject(HttpClient);
  private router = inject(Router);

  constructor(private characterService: CharacterService) {}

  getAccountId(): string {
    return this.accountId;
  }

  setAccountId(accountId: string): void {
    this.accountId = accountId;
  }

  signUp(data: CreateAccountRequestDTO) {
    return this.http.post<CreateAccountResponse>(
      `${BACKEND_URL}/${ApiRoutes.ACCOUNTS}`,
      data
    );
  }

  login(credentials: AuthLoginRequestDTO) {
    return this.http
      .post<AuthLoginResponse>(
        `${BACKEND_URL}/${ApiRoutes.AUTH}/login`,
        credentials,
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          if (response.success) {
            this.doLoginAccount(response.account._id);
            this.characterService.getAccountCharacters(this.accountId);
          }
        })
      );
  }

  logout() {
    return this.http
      .post<{
        success: boolean;
      }>(
        `${BACKEND_URL}/${ApiRoutes.AUTH}/logout`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap((response) => {
          if (response.success) {
            this.isAuthenticatedSubject.next(false);
            this.characterService.clearCharacterId();
            this.router.navigate(['/']);
          }
        })
      );
  }

  isLoggedIn(): Observable<boolean> {
    return this.http
      .get<AuthStatusResponse>(`${BACKEND_URL}/${ApiRoutes.AUTH}/status`, {
        withCredentials: true
      })
      .pipe(
        map((res) => {
          if (res.success) {
            this.isAuthenticatedSubject.next(res.authenticated);
            return res.authenticated;
          }
          this.characterService.clearCharacterId();
          this.isAuthenticatedSubject.next(false);
          return false;
        })
      );
  }

  private doLoginAccount(accountId: string) {
    this.setAccountId(accountId);
    this.isAuthenticatedSubject.next(true);
  }
}
