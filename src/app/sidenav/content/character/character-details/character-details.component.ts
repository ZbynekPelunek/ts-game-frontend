import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import {
  BasicAttribute,
  CharacterAttributeFrontend,
  CharacterFrontend,
  MiscAttributeId,
  PrimaryAttributeId,
  SecondaryAttributeId,
} from '../../../../../../../shared/src';
import { CharacterService } from '../character.service';

interface FinalAttribute {
  attributeId: string;
  'base-value': number;
  'added-value': number;
  'stats-value': number;
  label: string;
  type: string;
  desc?: string;
  percent?: boolean;
}

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.css']
})
export class CharacterDetailsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() characterData: CharacterFrontend;

  isLoading = true;
  private isAllStatsLoading = true;
  private isCharStatsLoading = true;

  private interval: NodeJS.Timer | undefined;

  characterAttributes: CharacterAttributeFrontend[];

  allAttributes: BasicAttribute[] = [];
  allAttributesHealth: BasicAttribute;
  allAttributesPower: BasicAttribute;

  primaryAttributes: FinalAttribute[];
  secondaryAttributes: FinalAttribute[];
  miscAttributes: FinalAttribute[];

  characterHealthBase: number;
  characterHealthAdded: number;
  characterHealthTotal: number;

  characterPowerBase: number;
  characterPowerAdded: number;
  characterPowerTotal: number;

  characterMinDamageBase: number;
  characterMinDamageAdded: number;
  characterMinDamageTotal: number;

  characterMaxDamageBase: number;
  characterMaxDamageAdded: number;
  characterMaxDamageTotal: number;

  finalAttributes: FinalAttribute[] = [];

  getAllAttributesSub: Subscription;
  getAllCharAttributesSub: Subscription;

  constructor(private characterService: CharacterService) { }

  ngOnInit(): void {
    // this.getAllAttributesSub = this.characterService.getAttributes().subscribe({
    //   next: (response) => {
    //     console.log('attributes response: ', response);
    //     this.allAttributes = response.attributes;
    //     this.allAttributesHealth = response.attributes.find(a => a.attributeId === PrimaryAttributeId.HEALTH);
    //     this.allAttributesPower = response.attributes.find(a => a.attributeId === PrimaryAttributeId.POWER);
    //     this.isAllStatsLoading = false;
    //   }
    // })

    this.getAllCharAttributesSub = this.characterService.getCharacterAttributes(this.characterData.characterId).subscribe({
      next: (response) => {
        console.log('character attributes response: ', response);
        this.characterAttributes = response.characterAttributes;
        this.isCharStatsLoading = false;
        this.isLoading = false;
      }
    })

    // this.interval = setInterval(() => {
    //   if (!this.isAllStatsLoading && !this.isCharStatsLoading) {
    //     this.filterStats();
    //     this.isLoading = false;
    //     clearInterval(this.interval);
    //   }
    // }, 1000);

  }

  ngOnChanges(): void {
    //this.filterStats();
  }

  // private filterStats() {
  //   this.characterAttributes.forEach(ca => {
  //     const att = this.allAttributes.find(aa => aa.attributeId === ca.attributeId);
  //     this.finalAttributes.push({
  //       "added-value": ca['added-value'],
  //       "base-value": ca['base-value'],
  //       "stats-value": ca['stats-value'],
  //       attributeId: att.attributeId,
  //       desc: att.desc,
  //       label: att.label,
  //       type: att.type,
  //       percent: att.isPercent
  //     })
  //   });
  //   this.primaryAttributes = this.finalAttributes.filter(s => s.attributeId in PrimaryAttributeId);
  //   this.secondaryAttributes = this.finalAttributes.filter(s => s.attributeId in SecondaryAttributeId);
  //   this.miscAttributes = this.finalAttributes.filter(s => s.attributeId in MiscAttributeId);

  //   this.characterHealthBase = this.primaryAttributes.find(pa => pa.attributeId === PrimaryAttributeId.HEALTH)['base-value'];
  //   this.characterHealthAdded = this.primaryAttributes.find(pa => pa.attributeId === PrimaryAttributeId.HEALTH)['added-value'];
  //   const charHealthStatsValue = this.primaryAttributes.find(pa => pa.attributeId === PrimaryAttributeId.HEALTH)['stats-value'];
  //   this.characterHealthTotal = this.characterHealthBase + this.characterHealthAdded + charHealthStatsValue;
  //   this.primaryAttributes = this.primaryAttributes.filter(pa => pa.attributeId !== PrimaryAttributeId.HEALTH);

  //   this.characterPowerBase = this.primaryAttributes.find(pa => pa.attributeId === PrimaryAttributeId.POWER)['base-value'];
  //   this.characterPowerAdded = this.primaryAttributes.find(pa => pa.attributeId === PrimaryAttributeId.POWER)['added-value'] ?? 0;
  //   this.characterPowerTotal = this.characterPowerBase + this.characterPowerAdded;
  //   this.primaryAttributes = this.primaryAttributes.filter(pa => pa.attributeId !== PrimaryAttributeId.POWER);

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
    this.getAllAttributesSub.unsubscribe();
    this.getAllCharAttributesSub.unsubscribe();
    this.interval ?? clearInterval(this.interval);
  }
}
