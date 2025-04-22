import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CharacterCreateService } from 'src/app/character-create/character-create.service';

import { CharacterFrontend } from '../../../../../../shared/src';
import { SidenavService } from '../../sidenav.service';
import { AuthService } from 'src/app/auth/auth.service';

interface Tile {
  cols: number;
  rows: number;
}

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit, OnDestroy {
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
  playerCharacter: CharacterFrontend;

  constructor(
    private sidenavService: SidenavService,
    public equipmentDialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    console.log('Getting character data...');
    this.characterId = this.authService.getCharacterId();
    this.sidenavService.getCharacter(this.characterId, true);
    this.charSub = this.sidenavService.getCharacterUpdateListener().subscribe({
      next: (response) => {
        this.playerCharacter = { ...response.character };
        this.isLoading = false;
        console.log('...character data fetched.: ', response);
      }
    });
  }

  ngOnDestroy(): void {
    this.charSub?.unsubscribe();
  }
}
