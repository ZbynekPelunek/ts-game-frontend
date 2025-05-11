import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApiRoutes,
  CharacterEquipmentPostActions,
  InventoryFrontend,
  InventoryPatchActions,
  ListInventoriesRequestQuery,
  ListInventoriesResponse
} from '../../../../../../../shared/src';
import { environment } from 'src/environments/environment';
import { CharacterEvents, EventBusService } from 'src/app/eventBus.service';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class CharacterInventoryService {
  private inventorySubject = new BehaviorSubject<InventoryFrontend[]>([]);
  private characterId: string;

  constructor(
    private http: HttpClient,
    private eventBus: EventBusService,
    private authService: AuthService
  ) {
    this.eventBus.getEvents().subscribe((event) => {
      if (event === CharacterEvents.REFRESH_INVENTORY) {
        this.listInventorySlots({
          characterId: this.characterId,
          populateItem: 'true'
        });
      }
    });
  }

  getInventory() {
    return this.inventorySubject.asObservable();
  }

  setCharacterId(characterId: string) {
    this.characterId = characterId;
  }

  listInventorySlots(params: ListInventoriesRequestQuery) {
    let queryParams = new HttpParams();

    // Iterate over the object and append the params
    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] !== undefined) {
        queryParams = queryParams.set(key, String(params[key]));
      }
    }

    this.http
      .get<ListInventoriesResponse>(`${BACKEND_URL}/${ApiRoutes.INVENTORY}`, {
        params: queryParams,
        withCredentials: true
      })
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.inventorySubject.next(response.inventories);
          }
        }
      });
  }

  equipItemFromInventory(body: { inventoryId: string }) {
    this.http
      .post(
        `${BACKEND_URL}/${ApiRoutes.CHARACTER_EQUIPMENT}/${CharacterEquipmentPostActions.EQUIP_ITEM}`,
        body,
        { withCredentials: true }
      )
      .subscribe({
        next: () => {
          this.eventBus.emitEvent(CharacterEvents.REFRESH_EQUIPMENT);
          this.eventBus.emitEvent(CharacterEvents.REFRESH_ATTRIBUTES);
          this.listInventorySlots({
            characterId: this.characterId,
            populateItem: 'true'
          });
        }
      });
  }

  sellItem(params: { inventorySlotId: string }) {
    this.http
      .patch(
        `${BACKEND_URL}/${ApiRoutes.INVENTORY}/${params.inventorySlotId}/${InventoryPatchActions.SELL_ITEM}`,
        null,
        { withCredentials: true }
      )
      .subscribe({
        next: () => {
          this.eventBus.emitEvent(CharacterEvents.REFRESH_CURRENCIES);
          this.listInventorySlots({
            characterId: this.characterId,
            populateItem: 'true'
          });
        }
      });
  }
}
