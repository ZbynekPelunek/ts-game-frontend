// src/app/character.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CharacterService {
  private readonly STORAGE_KEY = 'currentCharacterId';

  // BehaviorSubject holds the latest characterId (or null)
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
}
