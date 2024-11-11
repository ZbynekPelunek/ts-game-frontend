import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CharacterInventoryService } from './character-inventory.service';
import { Subject, takeUntil } from 'rxjs';
import {
  CommonItemParams,
  InventoryFrontend,
  InventoryItem,
} from '../../../../../../../shared/src';

@Component({
  selector: 'app-character-inventory',
  templateUrl: './character-inventory.component.html',
  styleUrls: ['./character-inventory.component.css'],
})
export class CharacterInventoryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() characterId: string;
  inventorySlots: InventoryFrontend[] = [];

  isLoading = true;

  selectedItem: any = null;

  constructor(private characterInventoryService: CharacterInventoryService) {}

  ngOnInit(): void {
    this.isLoading = true;
    console.log('Getting inventory data...');
    this.characterInventoryService
      .listInventorySlots({ characterId: this.characterId, populateItem: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('...inventory data fetched.: ', response);
          if (response.success) {
            this.inventorySlots = response.inventory;
            this.isLoading = false;
          }
        },
      });
  }

  onItemClick(item: any) {
    if (this.selectedItem === item) {
      this.selectedItem = null;
    } else {
      this.selectedItem = item;
    }
  }

  onEquip(item: InventoryItem, inventorySlotId: string) {
    console.log('Equip performed on', item);

    let itemId: number;

    if (this.isItemObject(item.itemId)) {
      itemId = item.itemId.itemId;
    } else {
      itemId = item.itemId;
    }

    this.characterInventoryService
      .equipItemFromInventory({
        characterId: this.characterId,
        itemId,
        inventoryId: inventorySlotId,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        console.log('equipItemFromInventory() response: ', res);
      });
  }

  onSell(inventorySlotId: string) {
    this.characterInventoryService
      .sellItem({
        inventorySlotId,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        console.log('sellItem() response: ', res);
      });
  }

  isItemObject(item: number | CommonItemParams): item is CommonItemParams {
    return (item as CommonItemParams).itemId !== undefined;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
