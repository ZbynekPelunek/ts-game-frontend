import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiRoutes, Response_Inventory_GET_all } from '../../../../../../../shared/src';
import { environment } from 'src/environments/environment';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class CharacterInventoryService {

  constructor(private http: HttpClient) {}

  listInventorySlots(characterId: string) {
    return this.http.get<Response_Inventory_GET_all>(`${BACKEND_URL}/${ApiRoutes.INVENTORY}`, { params: { characterId }})
  }
}