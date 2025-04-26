import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

import {
  CreateAccountRequestDTO,
  CreateAccountResponse,
  ListCharactersResponse,
  LoginAccountRequestDTO,
  LoginAccountResponse
} from '../../../../shared/src';
import { Router } from '@angular/router';
import { CharacterService } from '../sidenav/content/character/character.service';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private accountId: string;
  private hasCharactersSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  hasCharacters$ = this.hasCharactersSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private characterService: CharacterService
  ) {}

  getAccountId(): string {
    return this.accountId;
  }

  setAccountId(accountId: string): void {
    this.accountId = accountId;
  }

  setHasCharacters(flag: boolean): void {
    this.hasCharactersSubject.next(flag);
  }

  signUp(data: CreateAccountRequestDTO) {
    return this.http.post<CreateAccountResponse>(
      `${BACKEND_URL}/accounts`,
      data,
      { withCredentials: true }
    );
  }

  login(credentials: LoginAccountRequestDTO) {
    return this.http
      .post<LoginAccountResponse>(
        `${BACKEND_URL}/accounts/login`,
        credentials,
        {
          withCredentials: true
        }
      )
      .pipe(
        tap((response) => {
          if (response.success) {
            this.isAuthenticatedSubject.next(true);
            this.setAccountId(response.account._id);
            this.getAccountCharacters(this.accountId).subscribe({
              next: (response) => {
                if (response.success) {
                  console.log('Account Characters: ', response.characters);
                  if (response.characters.length === 0) {
                    this.hasCharactersSubject.next(false);
                    this.router.navigate(['/ui/character-create']);
                  } else {
                    this.hasCharactersSubject.next(true);
                    this.characterService.setCharacterId(
                      response.characters[0].characterId
                    );
                    this.router.navigate(['/ui/menu/character']);
                  }
                }
              }
            });
          }
        })
      );
  }

  logout() {
    return this.http
      .post<{ success: boolean }>(`${BACKEND_URL}/accounts/logout`, {})
      .pipe(
        tap((response) => {
          //console.log('authService logout() tap response: ', response);
          if (response.success) {
            this.isAuthenticatedSubject.next(false);
            this.hasCharactersSubject.next(false);
            this.characterService.clearCharacterId();
            this.router.navigate(['/']);
          }
        })
      );
  }

  getAccountCharacters(accountId: string) {
    return this.http.get<ListCharactersResponse>(`${BACKEND_URL}/characters`, {
      params: { accountId }
    });
  }
}
