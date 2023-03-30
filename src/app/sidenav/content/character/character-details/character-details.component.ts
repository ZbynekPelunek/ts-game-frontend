import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import {
  Attribute,
  AttributeType,
  CharacterAttribute,
  ICharacter,
  MiscAttributeId,
  PrimaryAttributeId,
  SecondaryAttributeId,
} from '../../../../../../../shared/src';
import { CharacterService } from '../character.service';

interface FinalAttribute {
  attributeId: PrimaryAttributeId | SecondaryAttributeId | MiscAttributeId;
  'base-value': number;
  'added-value': number;
  label: string;
  type: AttributeType.PRIMARY | AttributeType.SECONDARY | AttributeType.MISC;
  desc: string;
  percent?: boolean;
}

@Component({
  selector: 'app-character-details',
  templateUrl: './character-details.component.html',
  styleUrls: ['./character-details.component.css']
})
export class CharacterDetailsComponent implements OnInit, OnChanges, OnDestroy {
  isLoading = true;

  @Input() characterData: ICharacter;

  allAttributes: Attribute[] = [];
  allAttributesHealth: Attribute;
  allAttributesPower: Attribute;

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

  constructor(private characterService: CharacterService) { }

  ngOnInit(): void {
    this.getAllAttributesSub = this.characterService.getAttributes().subscribe({
      next: (response) => {
        console.log('attributes response', response);
        this.allAttributes = response.attributes;
        this.allAttributesHealth = response.attributes.find(a => a.attributeId === PrimaryAttributeId.HEALTH);
        this.allAttributesPower = response.attributes.find(a => a.attributeId === PrimaryAttributeId.POWER);
        this.isLoading = false;
        this.filterStats();
      }
    })
  }

  ngOnChanges(): void {
    //this.filterStats();
  }

  private filterStats() {
    const characterAttributes: CharacterAttribute[] = Object.values(this.characterData.attributes);
    characterAttributes.forEach(ca => {
      const att = this.allAttributes.find(aa => aa.attributeId === ca.attributeId);
      this.finalAttributes.push({
        "added-value": ca['added-value'],
        "base-value": ca['base-value'],
        attributeId: att.attributeId,
        desc: att.desc,
        label: att.label,
        type: att.type,
        percent: att.percent
      })
    });
    this.primaryAttributes = this.finalAttributes.filter(s => s.attributeId in PrimaryAttributeId);
    this.secondaryAttributes = this.finalAttributes.filter(s => s.attributeId in SecondaryAttributeId);
    this.miscAttributes = this.finalAttributes.filter(s => s.attributeId in MiscAttributeId);

    this.characterHealthBase = this.primaryAttributes.find(pa => pa.attributeId === PrimaryAttributeId.HEALTH)['base-value'];
    this.characterHealthAdded = this.primaryAttributes.find(pa => pa.attributeId === PrimaryAttributeId.HEALTH)['added-value'] ?? 0;
    this.characterHealthTotal = this.characterHealthBase + this.characterHealthAdded;

    this.characterPowerBase = this.primaryAttributes.find(pa => pa.attributeId === PrimaryAttributeId.POWER)['base-value'];
    this.characterPowerAdded = this.primaryAttributes.find(pa => pa.attributeId === PrimaryAttributeId.POWER)['added-value'] ?? 0;
    this.characterPowerTotal = this.characterPowerBase + this.characterPowerAdded;

    this.characterMinDamageBase = this.primaryAttributes.find(pa => pa.attributeId === PrimaryAttributeId.MIN_DAMAGE)['base-value'];
    this.characterMinDamageAdded = this.primaryAttributes.find(pa => pa.attributeId === PrimaryAttributeId.MIN_DAMAGE)['added-value'] ?? 0;
    this.characterMinDamageTotal = this.characterMinDamageBase + this.characterMinDamageAdded;

    this.characterMaxDamageBase = this.primaryAttributes.find(pa => pa.attributeId === PrimaryAttributeId.MAX_DAMAGE)['base-value'];
    this.characterMaxDamageAdded = this.primaryAttributes.find(pa => pa.attributeId === PrimaryAttributeId.MAX_DAMAGE)['added-value'] ?? 0;
    this.characterMaxDamageTotal = this.characterMaxDamageBase + this.characterMaxDamageAdded;
  }

  ngOnDestroy(): void {
    this.getAllAttributesSub.unsubscribe();
  }
}
