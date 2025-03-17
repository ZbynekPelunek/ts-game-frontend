import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApiRoutes,
  CharacterCurrencyFrontend,
  ListCharacterCurrenciesQuery,
  ListCharacterCurrenciesResponse
} from '../../../../../../../shared/src';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { CharacterCreateService } from 'src/app/character-create/character-create.service';
import { CharacterEvents, EventBusService } from 'src/app/eventBus.service';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class CharacterCurrenciesService {
  private currenciesSubject = new BehaviorSubject<CharacterCurrencyFrontend[]>(
    []
  );
  private characterId: string;

  constructor(
    private http: HttpClient,
    private eventBus: EventBusService,
    private characterCreateService: CharacterCreateService
  ) {
    this.characterId = characterCreateService.getCharacterId();
    this.eventBus.getEvents().subscribe((event) => {
      if (event === CharacterEvents.REFRESH_CURRENCIES) {
        this.listCharacterCurrencies({
          characterId: this.characterId,
          populateCurrency: 'true'
        });
      }
    });
  }

  getCurrencies() {
    return this.currenciesSubject.asObservable();
  }

  listCharacterCurrencies(params: ListCharacterCurrenciesQuery) {
    let queryParams = new HttpParams();

    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] !== undefined) {
        queryParams = queryParams.set(key, String(params[key]));
      }
    }

    this.http
      .get<ListCharacterCurrenciesResponse>(
        `${BACKEND_URL}/${ApiRoutes.CHARACTER_CURRENCIES}`,
        { params: queryParams }
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.currenciesSubject.next(response.characterCurrencies);
          }
        }
      });
  }
}
