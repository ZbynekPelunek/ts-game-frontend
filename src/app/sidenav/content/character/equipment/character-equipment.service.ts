import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ApiRoutes,
  CharacterEquipmentFrontend,
  CharacterEquipmentPatchActions,
  ListCharacterEquipmentsRequestQuery,
  ListCharacterEquipmentsResponse
} from '../../../../../../../shared/src';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { CharacterEvents, EventBusService } from 'src/app/eventBus.service';
import { AuthService } from 'src/app/auth/auth.service';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class CharacterEquipmentService {
  private equipmentSubject = new BehaviorSubject<CharacterEquipmentFrontend[]>(
    []
  );
  private characterId: string;

  constructor(
    private http: HttpClient,
    private eventBus: EventBusService,
    private authService: AuthService
  ) {
    this.eventBus.getEvents().subscribe((event) => {
      if (event === CharacterEvents.REFRESH_EQUIPMENT) {
        this.listCharacterEquipment({
          characterId: this.characterId,
          populateItem: 'true'
        });
      }
    });
  }

  getEquipment() {
    return this.equipmentSubject.asObservable();
  }

  setCharacterId(characterId: string) {
    this.characterId = characterId;
  }

  listCharacterEquipment(params: ListCharacterEquipmentsRequestQuery) {
    let queryParams = new HttpParams();

    // Iterate over the object and append the params
    for (const key in params) {
      if (params.hasOwnProperty(key) && params[key] !== undefined) {
        queryParams = queryParams.set(key, String(params[key]));
      }
    }

    this.http
      .get<ListCharacterEquipmentsResponse>(
        `${BACKEND_URL}/${ApiRoutes.CHARACTER_EQUIPMENT}`,
        { params: queryParams, withCredentials: true }
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.equipmentSubject.next(response.characterEquipments);
          }
        }
      });
  }

  unequipItem(params: { characterEquipmentId: string }) {
    this.http
      .patch(
        `${BACKEND_URL}/${ApiRoutes.CHARACTER_EQUIPMENT}/${params.characterEquipmentId}/${CharacterEquipmentPatchActions.UNEQUIP_ITEM}`,
        null,
        { withCredentials: true }
      )
      .subscribe({
        next: () => {
          this.eventBus.emitEvent(CharacterEvents.REFRESH_INVENTORY);
          this.eventBus.emitEvent(CharacterEvents.REFRESH_ATTRIBUTES);
          this.listCharacterEquipment({
            characterId: this.characterId,
            populateItem: 'true'
          });
        }
      });
  }

  sellEquipmentItem(params: { characterEquipmentId: string }) {
    this.http
      .patch(
        `${BACKEND_URL}/${ApiRoutes.CHARACTER_EQUIPMENT}/${params.characterEquipmentId}/${CharacterEquipmentPatchActions.SELL_ITEM}`,
        null,
        { withCredentials: true }
      )
      .subscribe({
        next: () => {
          this.eventBus.emitEvent(CharacterEvents.REFRESH_CURRENCIES);
          this.eventBus.emitEvent(CharacterEvents.REFRESH_ATTRIBUTES);
          this.listCharacterEquipment({
            characterId: this.characterId,
            populateItem: 'true'
          });
        }
      });
  }
}
