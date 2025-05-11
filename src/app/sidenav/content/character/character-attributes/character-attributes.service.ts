import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApiRoutes,
  CharacterAttributeDTO,
  ListCharacterAttributesResponse
} from '../../../../../../../shared/src';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { CharacterEvents, EventBusService } from 'src/app/eventBus.service';
import { AuthService } from 'src/app/auth/auth.service';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class CharacterDetailsService {
  private attributesSubject = new BehaviorSubject<CharacterAttributeDTO[]>([]);
  private characterId: string;

  constructor(
    private http: HttpClient,
    private eventBus: EventBusService,
    private authService: AuthService
  ) {
    this.eventBus.getEvents().subscribe((event) => {
      if (event === CharacterEvents.REFRESH_ATTRIBUTES) {
        this.getCharacterAttributes({
          characterId: this.characterId,
          populateAttribute: true
        });
      }
    });
  }

  getAttributes() {
    return this.attributesSubject.asObservable();
  }

  setCharacterId(characterId: string) {
    this.characterId = characterId;
  }

  getCharacterAttributes(params: {
    characterId?: string;
    populateAttribute?: boolean;
  }) {
    let queryParams = new HttpParams();

    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] !== undefined) {
        queryParams = queryParams.set(key, String(params[key]));
      }
    }

    this.http
      .get<ListCharacterAttributesResponse>(
        `${BACKEND_URL}/${ApiRoutes.CHARACTER_ATTRIBUTES}`,
        { params: queryParams, withCredentials: true }
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.attributesSubject.next(response.characterAttributes);
          }
        }
      });
  }
}
