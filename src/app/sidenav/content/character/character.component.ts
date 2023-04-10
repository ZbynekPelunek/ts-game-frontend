import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CharacterCreateService } from 'src/app/character-create/character-create.service';
import { EquipmentDialogComponent } from 'src/app/dialog/equipment/equipment-dialog.component';

import {
  CharacterFrontend,
  EquipmentSlotsArr,
  InventoryItem,
  ItemType,
} from '../../../../../../shared/src';
import {
  InventoryFrontend,
} from '../../../../../../shared/src/interface/character/inventory.interface';
import { SidenavService } from '../../sidenav.service';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit, OnDestroy {
  private charSub: Subscription;
  characterId: string;

  inventory: InventoryFrontend;
  equipmentSlots: EquipmentSlotsArr;

  isLoading = true;
  playerCharacter: CharacterFrontend;

  constructor(private sidenavService: SidenavService, public equipmentDialog: MatDialog, private characterCreateService: CharacterCreateService) { }

  ngOnInit(): void {
    this.isLoading = true;
    console.log('Getting character data...');
    this.characterId = this.characterCreateService.getCharacterId();
    this.sidenavService.getCharacter(this.characterId, true);
    this.charSub = this.sidenavService.getCharacterUpdateListener().subscribe({
      next: (response) => {
        this.playerCharacter = { ...response.character };
        this.inventory = typeof response.character.inventoryId === 'string' ? undefined : response.character.inventoryId;
        this.equipmentSlots = [...response.character.equipmentSlots];
        this.isLoading = false;
        console.log('...character data fetched.: ', response);
      }
    });
  }

  openItemDialog(item: InventoryItem): void {
    console.log('item clicked', item);
    if (item.itemType === ItemType.EQUIPMENT) {
      this.equipmentDialog.open(EquipmentDialogComponent, {
        width: '250px',
        data: item
      });
    }
  }

  ngOnDestroy(): void {
    this.charSub?.unsubscribe();
  }
}
