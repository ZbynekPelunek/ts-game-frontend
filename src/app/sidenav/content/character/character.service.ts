// src/app/character.service.ts
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import {
  CharacterDTO,
  GetCharacterResponse,
  ListCharactersResponse
} from '../../../../../../shared/src';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class CharacterService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly STORAGE_KEY = 'currentCharacterId';
  private characterUpdated = new Subject<{ character: CharacterDTO }>();
  character: CharacterDTO;

  getCharacterUpdateListener(): Observable<{ character: CharacterDTO }> {
    return this.characterUpdated.asObservable();
  }

  getCharacter(characterId: string, populateInventory: boolean = false) {
    let queryString = '';
    if (populateInventory) {
      queryString += 'populateInventory=true';
    }
    const isQueryString = queryString === '' ? '' : '?';

    this.http
      .get<GetCharacterResponse>(
        `${BACKEND_URL}/characters/${characterId}${isQueryString}${queryString}`,
        { withCredentials: true }
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.character = response.character;
            this.characterUpdated.next({ character: { ...this.character } });
          }
        },
        error: (err) => {
          if (err.status === 404) {
            console.error('Character not found.');
            this.clearCharacterId();
          }
        }
      });
  }

  private characterIdSubject = new BehaviorSubject<string | null>(
    this.loadFromStorage()
  );
  public currentCharacterId$ = this.characterIdSubject.asObservable();

  setCharacterId(id: string) {
    this.characterIdSubject.next(id);
    localStorage.setItem(this.STORAGE_KEY, id);
  }

  clearCharacterId() {
    this.characterIdSubject.next(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private loadFromStorage(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  getCurrentCharacterId(): string | null {
    return this.characterIdSubject.getValue();
  }

  getAccountCharacters(accountId: string) {
    this.http
      .get<ListCharactersResponse>(`${BACKEND_URL}/characters`, {
        params: { accountId },
        withCredentials: true
      })
      .subscribe({
        next: (response) => {
          if (response.success) {
            if (response.characters.length === 0) {
              this.router.navigate(['/ui/character-create']);
            } else {
              this.setCharacterId(response.characters[0]._id);
              this.router.navigate(['/ui/menu/character']);
            }
          }
        }
      });
  }
}
