import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

import {
  BasicAttribute,
  CharacterCurrencyFrontend,
  Response_CharacterAttributes_GET_all,
  Response_Inventories_GET_one,
} from '../../../../../../shared/src';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class CharacterService {

  constructor(private http: HttpClient) { }

  getAttributes(): Observable<{ success: boolean, attributes: BasicAttribute[] }> {
    return this.http.get<{ success: boolean, attributes: BasicAttribute[] }>(`${BACKEND_URL}/attributes`);
  }

  getSingleAttribute(attributeId: string): Observable<{ success: boolean, attribute: BasicAttribute }> {
    return this.http.get<{ success: boolean, attribute: BasicAttribute }>(`${BACKEND_URL}/attributes/${attributeId}`);
  }

  getCharacterAttributes(characterId: string, populateAttribute: boolean = false) {
    const queryString = [];
    if (populateAttribute) {
      queryString.push('populateAttribute=true');
    }
    if (characterId !== '') {
      queryString.push(`characterId=${characterId}`);
    }

    const isQueryString = queryString.length < 0 ? '' : '?';
    const finalQueryString = queryString.join('&&')

    return this.http.get<Response_CharacterAttributes_GET_all>(`${BACKEND_URL}/character-attributes${isQueryString}${finalQueryString}`);
  }

  getCharacterCurrencies(characterId: string, populateCurrencies: boolean = false) {
    const queryString = [];
    if (populateCurrencies) {
      queryString.push('populateCurrencies=true');
    }
    if (characterId !== '') {
      queryString.push(`characterId=${characterId}`);
    }

    const isQueryString = queryString.length < 0 ? '' : '?';
    const finalQueryString = queryString.join('&&')

    return this.http.get<{ success: boolean, characterCurrencies: CharacterCurrencyFrontend[] }>(`${BACKEND_URL}/character-currencies${isQueryString}${finalQueryString}`);
  }
}
