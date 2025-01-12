import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

import {
  CharacterEquipmentFrontend,
  CommonItemParams,
  UiPosition,
} from '../../../../../../../shared/src';
import { CharacterEquipmentService } from './character-equipment.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-character-equipment',
  templateUrl: './character-equipment.component.html',
  styleUrls: ['./character-equipment.component.css'],
})
export class CharacterEquipmentComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() characterId: string;

  isLoading = true;

  selectedItem: any = null;

  characterEquipment: CharacterEquipmentFrontend[] = [];
  leftEquipment: CharacterEquipmentFrontend[] = [];
  rightEquipment: CharacterEquipmentFrontend[] = [];
  bottomEquipment: CharacterEquipmentFrontend[] = [];

  constructor(private characterEquipmentService: CharacterEquipmentService) {}

  ngOnInit(): void {
    this.characterEquipmentService
      .listCharacterEquipment({
        characterId: this.characterId,
        populateItem: true,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('character equipment response: ', response);
          if (response.success) {
            this.characterEquipment = response.characterEquipment;
            this.filterUiPosition();
            this.isLoading = false;
          }
        },
      });
  }

  filterUiPosition() {
    this.leftEquipment = this.characterEquipment.filter(
      (e) => e.uiPosition === UiPosition.LEFT
    );
    this.rightEquipment = this.characterEquipment.filter(
      (e) => e.uiPosition === UiPosition.RIGHT
    );
    this.bottomEquipment = this.characterEquipment.filter(
      (e) => e.uiPosition === UiPosition.BOTTOM
    );
  }

  onItemClick(item: any) {
    if (this.selectedItem === item) {
      this.selectedItem = null;
    } else {
      this.selectedItem = item;
    }
  }

  onUnequip(characterEquipmentId: string) {
    console.log('Clicking on char equip with ID: ', characterEquipmentId);

    this.characterEquipmentService
      .unequipItem({ characterEquipmentId })
      .pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  isItemObject(
    itemId: null | number | CommonItemParams
  ): itemId is CommonItemParams {
    if (itemId === null) return false;
    return (itemId as CommonItemParams).itemId !== undefined;
  }

  ngOnDestroy(): void {
    this.isLoading = true;
    this.destroy$.next();
    this.destroy$.complete();
  }
}
