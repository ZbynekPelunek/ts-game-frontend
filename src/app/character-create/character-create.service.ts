import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import {
  CreateCharacterRequestBody,
  CreateCharacterResponse
} from '../../../../shared/src';
import { AuthService } from '../auth/auth.service';
import { tap } from 'rxjs';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class CharacterCreateService {
  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  createCharacter(body: CreateCharacterRequestBody) {
    return this.http
      .post<CreateCharacterResponse>(`${BACKEND_URL}/characters`, body)
      .pipe(
        tap((response) => {
          if (response.success) {
            this.authService.setHasCharacters(true);
            this.authService.setCharacterId(response.character.characterId);
          }
        })
      );
  }
}
