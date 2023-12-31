import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CharacterCreateService } from 'src/app/character-create/character-create.service';
import { EquipmentDialogComponent } from 'src/app/dialog/equipment/equipment-dialog.component';

import { CharacterFrontend, InventoryItemFrontend } from '../../../../../../shared/src';
import { SidenavService } from '../../sidenav.service';

interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit, OnDestroy {
  characterTile: Tile = { text: 'Character', cols: 2, rows: 1, color: 'lightblue' };
  currencyTile: Tile = { text: 'Currencies', cols: 1, rows: 1, color: 'lightgreen' };
  equipmentTile: Tile = { text: 'Equipment', cols: 2, rows: 1, color: 'lightpink' };
  inventoryTile: Tile = { text: 'Inventory', cols: 5, rows: 1, color: '#DDBDF1' };

  private charSub: Subscription;
  characterId: string;

  inventory = [];

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
        this.inventory = response.character.inventory;
        this.isLoading = false;
        console.log('...character data fetched.: ', response);
      }
    });
  }

  // openItemDialog(item: InventoryItem): void {
  //   console.log('item clicked', item);
  //   if (item.itemType === ItemType.EQUIPMENT) {
  //     this.equipmentDialog.open(EquipmentDialogComponent, {
  //       width: '250px',
  //       data: item
  //     });
  //   }
  // }

  ngOnDestroy(): void {
    this.charSub?.unsubscribe();
  }
}
