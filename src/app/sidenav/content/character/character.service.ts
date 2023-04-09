import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

import { BasicAttribute, CharacterAttributeFrontend, Response_Inventories_GET_one } from '../../../../../../shared/src';

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

  getCharacterAttributes(characterId: string) {
    return this.http.get<{ success: true, characterAttributes: CharacterAttributeFrontend[] }>(`${BACKEND_URL}/character-attributes?characterId=${characterId}`);
  }

  getInventory(inventoryId: string) {
    return this.http.get<Response_Inventories_GET_one>(`${BACKEND_URL}/inventories/${inventoryId}`);
  }
}
