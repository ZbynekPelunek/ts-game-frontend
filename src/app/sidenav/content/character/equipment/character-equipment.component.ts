import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import {
  CharacterEquipmentFrontend,
  CommonItemParams
} from '../../../../../../../shared/src';
import { CharacterEquipmentService } from './character-equipment.service';
import { Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ItemDetailsDialogComponent } from 'src/app/dialog/item-details/item-details-dialog.component';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-character-equipment',
  templateUrl: './character-equipment.component.html',
  styleUrls: ['./character-equipment.component.scss'],
  imports: [CommonModule, MatProgressSpinnerModule, MatCardModule]
})
export class CharacterEquipmentComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() characterId: string;

  isLoading = true;

  selectedItem: any = null;

  characterEquipment: CharacterEquipmentFrontend[] = [];

  constructor(
    private characterEquipmentService: CharacterEquipmentService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.characterEquipmentService.setCharacterId(this.characterId);
    this.characterEquipmentService
      .getEquipment()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.characterEquipment = response;
          this.isLoading = false;
        }
      });
    this.characterEquipmentService.listCharacterEquipment({
      characterId: this.characterId,
      populateItem: 'true'
    });
  }

  onItemClick(item: any) {
    if (this.selectedItem === item) {
      this.selectedItem = null;
    } else {
      this.selectedItem = item;
    }
  }

  openItemDetailsDialog(item: number | CommonItemParams): void {
    this.dialog.open(ItemDetailsDialogComponent, {
      width: '500px',
      data: { item }
    });
  }

  onUnequip(characterEquipmentId: string) {
    this.characterEquipmentService.unequipItem({ characterEquipmentId });
  }

  onSell(characterEquipmentId: string) {
    this.characterEquipmentService.sellEquipmentItem({ characterEquipmentId });
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
