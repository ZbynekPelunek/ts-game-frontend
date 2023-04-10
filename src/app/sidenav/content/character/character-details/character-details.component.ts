import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
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
export class CharacterDetailsComponent implements OnInit, OnChanges, OnDestroy {
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

  ngOnChanges(): void {
    //this.filterStats();
  }

  private generateStats() {
    // const health = this.characterAttributes.find((ca => ca.attribute.attributeName === MainAttributeNames.HEALTH));
    // this.characterHealthTotal = health['total-value'];
    // this.characterHealthLabel = health.attribute.label;

    // const power = this.characterAttributes.find((ca => ca.attribute.attributeName === MainAttributeNames.POWER));
    // this.characterPowerTotal = power['total-value'];
    // this.characterPowerLabel = power.attribute.label;

    // const minDamage = this.characterAttributes.find((ca => ca.attribute.attributeName === MainAttributeNames.MIN_DAMAGE));

    this.mainAttributes = this.characterAttributes.filter(s => s.attribute.attributeName in MainAttributeNames);
    this.primaryAttributes = this.characterAttributes.filter(s => s.attribute.attributeName in PrimaryAttributeNames);
    this.secondaryAttributes = this.characterAttributes.filter(s => s.attribute.attributeName in SecondaryAttributeNames);
    this.miscAttributes = this.characterAttributes.filter(s => s.attribute.attributeName in MiscAttributeNames);
  }
  // private filterStats() {

  //   this.characterMinDamageBase = this.primaryAttributes.find(pa => pa.attributeId === PrimaryAttributeId.MIN_DAMAGE)['base-value'];
  //   this.characterMinDamageAdded = this.primaryAttributes.find(pa => pa.attributeId === PrimaryAttributeId.MIN_DAMAGE)['added-value'] ?? 0;
  //   this.characterMinDamageTotal = this.characterMinDamageBase + this.characterMinDamageAdded;
  //   this.primaryAttributes = this.primaryAttributes.filter(pa => pa.attributeId !== PrimaryAttributeId.MIN_DAMAGE);

  //   this.characterMaxDamageBase = this.primaryAttributes.find(pa => pa.attributeId === PrimaryAttributeId.MAX_DAMAGE)['base-value'];
  //   this.characterMaxDamageAdded = this.primaryAttributes.find(pa => pa.attributeId === PrimaryAttributeId.MAX_DAMAGE)['added-value'] ?? 0;
  //   this.characterMaxDamageTotal = this.characterMaxDamageBase + this.characterMaxDamageAdded;
  //   this.primaryAttributes = this.primaryAttributes.filter(pa => pa.attributeId !== PrimaryAttributeId.MAX_DAMAGE);
  // }

  ngOnDestroy(): void {
    this.getAllCharAttributesSub.unsubscribe();
  }
}
