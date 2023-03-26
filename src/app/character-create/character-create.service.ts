import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

import { AuthService } from '../auth/auth.service';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class CharacterCreateService {
  private charCreatingListener = new Subject<boolean>();
  private characterId: string;

  charCreating$ = this.charCreatingListener.asObservable();

  constructor(private router: Router, private http: HttpClient) { }

  setCharCreatingValue(value: boolean): void {
    this.charCreatingListener.next(value);
  }

  getCharacterId(): string {
    return this.characterId;
  }

  create(accountId: string): void {
    this.http.post<{ characterId: string }>(`${BACKEND_URL}/characters`, { accountId, name: 'TESTNAME' }).subscribe({
      next: (response) => {
        console.log('character created: ', response);
        this.characterId = response.characterId as unknown as string;
        this.setCharCreatingValue(false);
        this.router.navigate(['/ui/menu/character']);
      }
    })

  }
}
