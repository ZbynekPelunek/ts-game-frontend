import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApiRoutes,
  CharacterEquipmentPatchActions,
  Request_CharacterEquipment_GET_all_query,
  Response_CharacterEquipment_GET_all,
} from '../../../../../../../shared/src';
import { environment } from 'src/environments/environment';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class CharacterEquipmentService {
  constructor(private http: HttpClient) {}

  listCharacterEquipment(params: Request_CharacterEquipment_GET_all_query) {
    let queryParams = new HttpParams();

    // Iterate over the object and append the params
    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] !== undefined) {
        queryParams = queryParams.set(key, String(params[key]));
      }
    }

    return this.http.get<Response_CharacterEquipment_GET_all>(
      `${BACKEND_URL}/${ApiRoutes.CHARACTER_EQUIPMENT}`,
      { params: queryParams }
    );
  }

  unequipItem(params: { characterEquipmentId: string }) {
    return this.http.patch(
      `${BACKEND_URL}/${ApiRoutes.CHARACTER_EQUIPMENT}/${params.characterEquipmentId}/${CharacterEquipmentPatchActions.UNEQUIP_ITEM}`,
      null
    );
  }

  // sellItem(params: { inventorySlotId: string }) {
  //   return this.http.patch(
  //     `${BACKEND_URL}/${ApiRoutes.INVENTORY}/${params.inventorySlotId}/${InventoryPatchActions.SELL_ITEM}`,
  //     null
  //   );
  // }
}
