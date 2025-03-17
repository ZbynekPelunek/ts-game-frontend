import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { environment } from 'src/environments/environment';

import {
  CharacterFrontend,
  GetCharacterResponse
} from '../../../../shared/src';
import { CharacterCreateService } from '../character-create/character-create.service';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class SidenavService {
  private characterUpdated = new Subject<{ character: CharacterFrontend }>();
  //private inventoryUpdated = new Subject<({ inventory: Inventory[] })>();
  //private equipmentSlotsUpdated = new Subject<({ equipmentSlots: EquipmentSlotsArr[] })>();
  //equipmentSlots: EquipmentSlotsArr[] = [];
  //inventory: Inventory[] = [];
  character: CharacterFrontend;

  constructor(
    private http: HttpClient,
    private characterCreateService: CharacterCreateService
  ) {}

  getCharacterUpdateListener(): Observable<{ character: CharacterFrontend }> {
    return this.characterUpdated.asObservable();
  }

  // getInvetoryUpdateListener(): Observable<{ inventory: Inventory[] }> {
  //   return this.inventoryUpdated.asObservable();
  // }

  // getEquipmentSlotsUpdateListener(): Observable<{ equipmentSlots: EquipmentSlotsArr[] }> {
  //   return this.equipmentSlotsUpdated.asObservable();
  // }

  getCharacter(characterId: string, populateInventory: boolean = false) {
    let queryString = '';
    if (populateInventory) {
      queryString += 'populateInventory=true';
    }
    const isQueryString = queryString === '' ? '' : '?';

    console.log('getCharacter() characterID: ', characterId);

    this.http
      .get<GetCharacterResponse>(
        `${BACKEND_URL}/characters/${characterId}${isQueryString}${queryString}`
      )
      .subscribe({
        next: (response) => {
          console.log('getCharacter() response: ', response);
          if (response.success) {
            this.character = response.character;
            this.characterUpdated.next({ character: { ...this.character } });
          }
        }
      });
  }
}
