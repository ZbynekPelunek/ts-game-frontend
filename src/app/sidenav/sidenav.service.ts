import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Subject } from 'rxjs/internal/Subject';
import { environment } from 'src/environments/environment';

import {
  AdventureActions,
  AdventureResult,
  AdventureState,
  CharacterActions,
  CharacterFrontend,
  EquipableItem,
  EquipmentSlotsArr,
  GET_characterAdventuresAll,
  IAdventure,
  Inventory,
  InventoryItem,
  ItemType,
  POST_characterActions,
  PUT_characterByID,
  Response_Characters_GET_one,
} from '../../../../shared/src';
import { CharacterCreateService } from '../character-create/character-create.service';

const BACKEND_URL = `${environment.apiUrl}`;

interface AdventureStartResponse {
  message: string;
  result: {
    resultId: string;
    timeStarted: string;
    timeFinished: string;
    adventure: IAdventure;
  }
}

interface CharacterAdventuresUpdateSubject {
  adventures: IAdventure[]
}

@Injectable({ providedIn: 'root' })
export class SidenavService {
  private characterUpdated = new Subject<{ character: CharacterFrontend }>();
  private inventoryUpdated = new Subject<({ inventory: Inventory[] })>();
  private equipmentSlotsUpdated = new Subject<({ equipmentSlots: EquipmentSlotsArr[] })>();
  private characterAdventuresUpdated = new Subject<(CharacterAdventuresUpdateSubject)>();
  equipmentSlots: EquipmentSlotsArr[] = [];
  inventory: Inventory[] = [];
  character: CharacterFrontend;
  charAdventures: IAdventure[];

  constructor(private http: HttpClient, private characterCreateService: CharacterCreateService) { }

  getCharacterUpdateListener(): Observable<{ character: CharacterFrontend }> {
    return this.characterUpdated.asObservable();
  }

  getInvetoryUpdateListener(): Observable<{ inventory: Inventory[] }> {
    return this.inventoryUpdated.asObservable();
  }

  getEquipmentSlotsUpdateListener(): Observable<{ equipmentSlots: EquipmentSlotsArr[] }> {
    return this.equipmentSlotsUpdated.asObservable();
  }

  getCharacterAdventuresUpdateListener(): Observable<CharacterAdventuresUpdateSubject> {
    return this.characterAdventuresUpdated.asObservable();
  }

  getCharacter() {
    this.http.get<Response_Characters_GET_one>(`${BACKEND_URL}/characters/${this.characterCreateService.getCharacterId()}`).subscribe({
      next: (response) => {
        console.log('getCharacter() response: ', response);
        if (response.success) {
          this.character = response.character;
          this.characterUpdated.next({ character: { ...this.character } });
        }

      }
    });

  }

  updateCharacter(characterId: string, character: CharacterFrontend): void {
    this.http.put<PUT_characterByID>(`${BACKEND_URL}/characters/${characterId}`, { character: character }).subscribe({
      next: (response) => {
        console.log('update char response: ', response.character);
      }
    })
  }

  equipCharacter(equipment: EquipableItem): void {
    this.http.post<POST_characterActions>(`${BACKEND_URL}/characters/${this.characterCreateService.getCharacterId()}/actions/${CharacterActions.EQUIP_ITEM}`, { item: equipment }).subscribe({
      next: (response) => {
        console.log('equipCharacter() response: ', response);
        this.character = response.character;
        this.characterUpdated.next({ character: { ...this.character } });
      }
    });
  }

  unequipCharacter(equipment: EquipableItem): void {
    this.http.post<POST_characterActions>(`${BACKEND_URL}/characters/${this.characterCreateService.getCharacterId()}/actions/${CharacterActions.UNEQUIP_ITEM}`, { item: equipment }).subscribe({
      next: (response) => {
        console.log('unequipCharacter() response: ', response);
        this.character = response.character;
        this.characterUpdated.next({ character: { ...this.character } });
      }
    });
  }

  sellItem(item: InventoryItem): void {
    this.http.post<POST_characterActions>(`${BACKEND_URL}/characters/${this.characterCreateService.getCharacterId()}/actions/${CharacterActions.SELL}`, { item }).subscribe({
      next: (response) => {
        console.log('sellItem() response: ', response);
        this.character = response.character;
        this.characterUpdated.next({ character: { ...this.character } });
      }
    });
  }

  checkEquipableStatus(equipment: EquipableItem): boolean {
    if (equipment.itemType === ItemType.EQUIPMENT) {
      return true;
    }
    return false;
  }

  getInventory(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${BACKEND_URL}/characters/${this.characterCreateService.getCharacterId()}/inventory`);
  }

  getEquipmentSlots(): EquipmentSlotsArr[] {
    return this.equipmentSlots;
  }

  getCharacterAdventures(): void {
    this.http.get<GET_characterAdventuresAll>(`${BACKEND_URL}/characters/${this.characterCreateService.getCharacterId()}/adventures`).subscribe({
      next: (response) => {
        console.log('getCharAdvs() response: ', response);
        this.charAdventures = response.adventures;
        this.characterAdventuresUpdated.next({ adventures: [...this.charAdventures] });
      }
    })
  }

  getAdventures(): Observable<IAdventure[]> {
    return this.http.get<IAdventure[]>(`${BACKEND_URL}/adventures`);
  }

  getAdventureById(adventureId: string): Observable<IAdventure> {
    return this.http.get<IAdventure>(`${BACKEND_URL}/adventures/${adventureId}`);
  }

  startAdventure(adventureId: string, characterId: string) {
    this.http.post<AdventureStartResponse>(`${BACKEND_URL}/adventures/${adventureId}/actions/${AdventureActions.START}`, { character: { characterId } }).subscribe({
      next: (response) => {
        console.log('startAdventure2() response: ', response);
        const adventure = response.result.adventure;

        adventure.timer = {
          ...adventure.timer,
          progressPercent: 100,
          timeLeft: adventure.timeInSeconds,
          intervalId: this.startTimer(adventure)
        }

        this.charAdventures[this.charAdventures.findIndex(a => a.adventureId === adventureId)] = { ...adventure };

        this.characterAdventuresUpdated.next({ adventures: [...this.charAdventures] });
      }
    });
  }

  startTimer(adventure: IAdventure) {
    return setInterval(() => {
      adventure.timer.timeLeft = new Date(adventure.timer.timeFinished).getTime() - new Date().getTime();
      console.log(adventure.timer.timeLeft, 'ms');
      adventure.timer.progressPercent = Math.floor((100 * adventure.timer.timeLeft) / (adventure.timeInSeconds * 1000));
      console.log(adventure.timer.progressPercent, '%');
      if (adventure.timer.timeLeft <= 0) {
        console.log('adventure done');
        this.getAdventureResult(adventure.resultId);
        clearInterval(adventure.timer.intervalId as NodeJS.Timer);

        // SHOW isAttacking TEMPLATE WITH PLAYER VS ENEMY
        // AdventureState.FINISHED -> AdventureState.IDLE
      }
    }, 1000);
  }

  getAdventureResult(resultId: string) {
    this.http.get<{ result: AdventureResult }>(`${BACKEND_URL}/results/${resultId}`).subscribe({
      next: (response) => {
        const adventureIndex = this.charAdventures.findIndex(a => a.adventureId === response.result.adventureId);
        this.charAdventures[adventureIndex] = { ...this.charAdventures[adventureIndex], adventureState: AdventureState.IDLE };

        this.characterAdventuresUpdated.next({ adventures: [...this.charAdventures] });
        this.getCharacter();
      }
    });
  }
}
