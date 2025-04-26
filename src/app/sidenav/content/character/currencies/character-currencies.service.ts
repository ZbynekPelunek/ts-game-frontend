import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApiRoutes,
  CharacterCurrencyFrontend,
  CurrencyDTO,
  CurrencyId,
  ListCharacterCurrenciesQuery,
  ListCharacterCurrenciesResponse
} from '../../../../../../../shared/src';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { CharacterCreateService } from 'src/app/character-create/character-create.service';
import { CharacterEvents, EventBusService } from 'src/app/eventBus.service';
import { AuthService } from 'src/app/auth/auth.service';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class CharacterCurrenciesService {
  private currenciesSubject = new BehaviorSubject<CharacterCurrencyFrontend[]>(
    []
  );
  private characterId: string;
  private cachedCurrencies: CharacterCurrencyFrontend[] = [];

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
        { params: queryParams }
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.currenciesSubject.next(response.characterCurrencies);
            if (cache) {
              this.cachedCurrencies = response.characterCurrencies;
            }
          }
        }
      });
  }

  getCachedCurrency(currencyId: CurrencyId): CurrencyDTO | undefined {
    const response = this.cachedCurrencies.find((c) => {
      if (typeof c.currencyId === 'object' && c.currencyId !== null) {
        return c.currencyId._id === currencyId;
      }
      return false;
    })?.currencyId as CurrencyDTO;

    return response;
  }
}
