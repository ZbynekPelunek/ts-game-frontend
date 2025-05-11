import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { SidenavService } from '../../sidenav.service';
import { AuthService } from 'src/app/auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { CharacterAttributesComponent } from './character-attributes/character-attributes.component';
import { CharacterCurrenciesComponent } from './currencies/character-currencies.component';
import { CharacterEquipmentComponent } from './equipment/character-equipment.component';
import { CharacterInventoryComponent } from './inventory/character-inventory.component';
import { CharacterService } from './character.service';
import { Router } from '@angular/router';
import { Character, CharacterDTO } from '../../../../../../shared/src';

interface Tile {
  cols: number;
  rows: number;
}

@Component({
  standalone: true,
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css'],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatGridListModule,
    CharacterAttributesComponent,
    CharacterCurrenciesComponent,
    CharacterEquipmentComponent,
    CharacterInventoryComponent
  ]
})
export class CharacterComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  characterTile: Tile = {
    cols: 2,
    rows: 1
  };
  currencyTile: Tile = {
    cols: 1,
    rows: 1
  };
  equipmentTile: Tile = {
    cols: 2,
    rows: 1
  };
  inventoryTile: Tile = {
    cols: 5,
    rows: 1
  };
  private charSub: Subscription;
  characterId: string;

  isLoading = true;
  playerCharacter: CharacterDTO;

  constructor(
    public equipmentDialog: MatDialog,
    private characterService: CharacterService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.characterService.currentCharacterId$.subscribe({
      next: (id) => {
        this.characterId = id;

        if (id) {
          this.characterService.getCharacter(this.characterId, true);
          this.charSub = this.characterService
            .getCharacterUpdateListener()
            .subscribe({
              next: (response) => {
                this.playerCharacter = { ...response.character };
                this.isLoading = false;
              }
            });
        } else {
          const accountId = this.authService.getAccountId();
          if (accountId) {
            this.characterService.getAccountCharacters(accountId);
          } else {
            // TODO: Maybe allow getting character using accountID from token?
            this.router.navigate(['/ui/auth/login']);
          }
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.charSub?.unsubscribe();
  }
}
