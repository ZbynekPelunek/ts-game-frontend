import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApiRoutes,
  Request_Inventory_GET_all_query,
  Response_Inventory_GET_all,
} from '../../../../../../../shared/src';
import { environment } from 'src/environments/environment';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class CharacterInventoryService {
  constructor(private http: HttpClient) {}

  listInventorySlots(params: Request_Inventory_GET_all_query) {
    let queryParams = new HttpParams();

    // Iterate over the object and append the params
    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] !== undefined) {
        queryParams = queryParams.set(key, String(params[key]));
      }
    }

    return this.http.get<Response_Inventory_GET_all>(
      `${BACKEND_URL}/${ApiRoutes.INVENTORY}`,
      { params: queryParams }
    );
  }
}
