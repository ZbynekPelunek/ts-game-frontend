import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import {
  BasicAttribute,
  CharacterAttributeDTO,
  MainAttributeNames,
  MiscAttributeNames,
  PrimaryAttributeNames,
  SecondaryAttributeNames,
} from '../../../../../../../shared/src';
import { CharacterService } from '../character.service';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.css'],
})
export class CharacterDetailsComponent implements OnInit, OnDestroy {
  @Input() characterId: string;

  isLoading = true;

  characterAttributes: CharacterAttributeDTO[];

  allAttributes: BasicAttribute[] = [];

  mainAttributes: CharacterAttributeDTO[];
  primaryAttributes: CharacterAttributeDTO[];
  secondaryAttributes: CharacterAttributeDTO[];
  miscAttributes: CharacterAttributeDTO[];

  characterHealthLabel: string;
  characterHealthBase: number;
  characterHealthAdded: number;
  characterHealthTotal: number;

  characterPowerLabel: string;
  characterPowerBase: number;
  characterPowerAdded: number;
  characterPowerTotal: number;

  characterMinDamageBase: number;
  characterMinDamageAdded: number;
  characterMinDamageTotal: number;

  characterMaxDamageBase: number;
  characterMaxDamageAdded: number;
  characterMaxDamageTotal: number;

  getAllCharAttributesSub: Subscription;

  constructor(private characterService: CharacterService) {}

  ngOnInit(): void {
    this.getAllCharAttributesSub = this.characterService
      .getCharacterAttributes(this.characterId, true)
      .subscribe({
        next: (response) => {
          console.log('character attributes response: ', response);
          if (response.success) {
            this.characterAttributes = response.characterAttributes;
            this.isLoading = false;
            this.generateStats();
          }
        },
      });
  }

  private generateStats() {
    this.mainAttributes = this.characterAttributes.filter(
      (s) => s.attributeName in MainAttributeNames
    );
    this.primaryAttributes = this.characterAttributes.filter(
      (s) => s.attributeName in PrimaryAttributeNames
    );
    this.secondaryAttributes = this.characterAttributes.filter(
      (s) => s.attributeName in SecondaryAttributeNames
    );
    this.miscAttributes = this.characterAttributes.filter(
      (s) => s.attributeName in MiscAttributeNames
    );
  }

  ngOnDestroy(): void {
    this.getAllCharAttributesSub.unsubscribe();
  }
}
