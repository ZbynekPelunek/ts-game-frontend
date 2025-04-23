import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import {
  BasicAttribute,
  CharacterAttributeDTO,
  MainAttributeNames,
  MiscAttributeNames,
  PrimaryAttributeNames,
  SecondaryAttributeNames
} from '../../../../../../../shared/src';
import { CharacterDetailsService } from './character-attributes.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  standalone: true,
  selector: 'app-character-attributes',
  templateUrl: './character-attributes.component.html',
  styleUrls: ['./character-attributes.component.scss'],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    ScrollingModule
  ]
})
export class CharacterAttributesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
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

  constructor(private characterDetailsService: CharacterDetailsService) {}

  ngOnInit(): void {
    this.characterDetailsService
      .getAttributes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('character attributes response: ', response);

          this.characterAttributes = response;
          this.isLoading = false;
          this.generateStats();
        }
      });

    this.characterDetailsService.getCharacterAttributes({
      characterId: this.characterId,
      populateAttribute: true
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
    this.destroy$.next();
    this.destroy$.complete();
  }
}
