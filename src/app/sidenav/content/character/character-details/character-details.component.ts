import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import {
  BasicAttribute,
  CharacterAttributeFrontend,
  CharacterFrontend,
  MainAttributeNames,
  MiscAttributeNames,
  PrimaryAttributeNames,
  SecondaryAttributeNames,
} from '../../../../../../../shared/src';
import { CharacterService } from '../character.service';

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.css']
})
export class CharacterDetailsComponent implements OnInit, OnDestroy {
  @Input() characterData: CharacterFrontend;

  isLoading = true;

  characterAttributes: CharacterAttributeFrontend[];

  allAttributes: BasicAttribute[] = [];

  mainAttributes: CharacterAttributeFrontend[];
  primaryAttributes: CharacterAttributeFrontend[];
  secondaryAttributes: CharacterAttributeFrontend[];
  miscAttributes: CharacterAttributeFrontend[];

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

  getAllAttributesSub: Subscription;
  getAllCharAttributesSub: Subscription;

  constructor(private characterService: CharacterService) { }

  ngOnInit(): void {
    console.log('character-details characterData: ', this.characterData);
    this.getAllCharAttributesSub = this.characterService.getCharacterAttributes(this.characterData.characterId, true).subscribe({
      next: (response) => {
        console.log('character attributes response: ', response);
        if (response.success) {
          this.characterAttributes = response.characterAttributes;
          this.isLoading = false;
          this.generateStats();
        }
      }
    })

  }

  private generateStats() {
    this.mainAttributes = this.characterAttributes.filter(s => s.attribute.attributeName in MainAttributeNames);
    this.primaryAttributes = this.characterAttributes.filter(s => s.attribute.attributeName in PrimaryAttributeNames);
    this.secondaryAttributes = this.characterAttributes.filter(s => s.attribute.attributeName in SecondaryAttributeNames);
    this.miscAttributes = this.characterAttributes.filter(s => s.attribute.attributeName in MiscAttributeNames);
  }

  ngOnDestroy(): void {
    this.getAllCharAttributesSub.unsubscribe();
  }
}
