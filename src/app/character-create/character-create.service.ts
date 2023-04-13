import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

import { Response_Characters_POST } from '../../../../shared/src';

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
    this.http.post<Response_Characters_POST>(`${BACKEND_URL}/characters`, { accountId, name: 'TESTNAME' }).subscribe({
      next: (response) => {
        console.log('character created: ', response);
        if (response.success) {
          this.characterId = response.character.characterId;
          console.log('created character ID: ', this.characterId);
        }
        this.setCharCreatingValue(false);
        this.router.navigate(['/ui/menu/character']);
      }
    })

  }
}
