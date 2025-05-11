import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import {
  CreateCharacterRequestDTO,
  CreateCharacterResponse
} from '../../../../shared/src';
import { tap } from 'rxjs';
import { CharacterService } from '../sidenav/content/character/character.service';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class CharacterCreateService {
  constructor(
    private http: HttpClient,
    private characterService: CharacterService
  ) {}

  createCharacter(body: CreateCharacterRequestDTO) {
    return this.http
      .post<CreateCharacterResponse>(`${BACKEND_URL}/characters`, body, {
        withCredentials: true
      })
      .pipe(
        tap((response) => {
          if (response.success) {
            this.characterService.setCharacterId(response.character._id);
          }
        })
      );
  }
}
