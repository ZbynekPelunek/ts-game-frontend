import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

import {
  Request_Character_POST_body,
  Response_Character_POST
} from '../../../../shared/src';
import { MatSnackBar } from '@angular/material/snack-bar';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class CharacterCreateService {
  private charCreatingListener = new Subject<boolean>();
  private characterId: string;

  charCreating$ = this.charCreatingListener.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) {}

  setCharCreatingValue(value: boolean): void {
    this.charCreatingListener.next(value);
  }

  getCharacterId(): string {
    return this.characterId;
  }

  createCharacter(body: Request_Character_POST_body) {
    this.http
      .post<Response_Character_POST>(`${BACKEND_URL}/characters`, body)
      .subscribe({
        next: (response) => {
          console.log('character created: ', response);
          if (response.success) {
            this.characterId = response.character.characterId;
            console.log('created character ID: ', this.characterId);
          }
          this.setCharCreatingValue(false);
          this.router.navigate(['/ui/menu/character']);
        },
        error: (err) => {
          this.snackBar.open(err, 'OK', {
            duration: 30000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
  }
}
