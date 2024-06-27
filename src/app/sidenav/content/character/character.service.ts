import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

import {
  Request_CharacterCurrency_GET_all_query,
  Response_CharacterAttribute_GET_all,
  Response_CharacterCurrency_GET_all,
  Response_CharacterEquipment_GET_all,

} from '../../../../../../shared/src';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class CharacterService {

  constructor(private http: HttpClient) { }

  // getAttributes(): Observable<{ success: boolean, attributes: BasicAttribute[] }> {
  //   return this.http.get<{ success: boolean, attributes: BasicAttribute[] }>(`${BACKEND_URL}/attributes`);
  // }

  // getSingleAttribute(attributeId: string): Observable<{ success: boolean, attribute: BasicAttribute }> {
  //   return this.http.get<{ success: boolean, attribute: BasicAttribute }>(`${BACKEND_URL}/attributes/${attributeId}`);
  // }

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

    return this.http.get<Response_CharacterAttribute_GET_all>(`${BACKEND_URL}/character-attributes${isQueryString}${finalQueryString}`);
  }

  getCharacterCurrencies(characterId: string, populateCurrencies: boolean = false) {
    const queryString: Request_CharacterCurrency_GET_all_query = {};

    if (populateCurrencies) {
      queryString.populateCurrency = true;
    }
    if (characterId) {
      queryString.characterId=characterId;
    }

    return this.http.get<Response_CharacterCurrency_GET_all>(`${BACKEND_URL}/character-currencies`, {params: queryString as HttpParams});
  }

  getCharacterEquipment(characterId: string) {
    return this.http.get<Response_CharacterEquipment_GET_all>(`${BACKEND_URL}/character-equipment?characterId=${characterId}`);
  }
}
