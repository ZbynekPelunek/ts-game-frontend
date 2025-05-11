import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApiRoutes,
  CharacterCurrencyDTO,
  CurrencyDTO,
  CurrencyId,
  ListCharacterCurrenciesQuery,
  ListCharacterCurrenciesResponse
} from '../../../../../../../shared/src';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { CharacterEvents, EventBusService } from 'src/app/eventBus.service';
import { AuthService } from 'src/app/auth/auth.service';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class CharacterCurrenciesService {
  private currenciesSubject = new BehaviorSubject<CharacterCurrencyDTO[]>([]);
  private characterId: string;
  private cachedCurrencies: CurrencyDTO[] = [];

  constructor(
    private http: HttpClient,
    private eventBus: EventBusService,
    private authService: AuthService
  ) {
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

  setCharacterId(characterId: string) {
    this.characterId = characterId;
  }

  listCharacterCurrencies(
    params: ListCharacterCurrenciesQuery,
    cache?: boolean
  ) {
    let queryParams = new HttpParams();

    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] !== undefined) {
        queryParams = queryParams.set(key, String(params[key]));
      }
    }

    this.http
      .get<ListCharacterCurrenciesResponse>(
        `${BACKEND_URL}/${ApiRoutes.CHARACTER_CURRENCIES}`,
        { params: queryParams, withCredentials: true }
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.currenciesSubject.next(response.characterCurrencies);
            if (cache) {
              this.cachedCurrencies = response.characterCurrencies.map(
                (charCurr) => charCurr.currency
              );
            }
          }
        }
      });
  }

  getCachedCurrency(currencyId: CurrencyId): CurrencyDTO {
    const response = this.cachedCurrencies.find((c) => {
      return c._id === currencyId;
    });

    return response;
  }
}
