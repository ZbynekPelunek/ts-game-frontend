import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CharacterInventoryService } from './character-inventory.service';
import { Subscription } from 'rxjs';
import {
  CommonItemParams,
  InventoryFrontend,
} from '../../../../../../../shared/src';

@Component({
  selector: 'app-character-inventory',
  templateUrl: './character-inventory.component.html',
  styleUrls: ['./character-inventory.component.css'],
})
export class CharacterInventoryComponent implements OnInit, OnDestroy {
  @Input() characterId: string;
  private inventorySub: Subscription;
  inventorySlots: InventoryFrontend[] = [];

  isLoading = true;

  constructor(private characterInventoryService: CharacterInventoryService) {}

  ngOnInit(): void {
    this.isLoading = true;
    console.log('Getting inventory data...');
    this.inventorySub = this.characterInventoryService
      .listInventorySlots({ characterId: this.characterId, populateItem: true })
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

  // Type guard to check if item is an Item object
  isItemObject(item: number | CommonItemParams): item is CommonItemParams {
    return (item as CommonItemParams).itemId !== undefined;
  }

  ngOnDestroy(): void {
    this.inventorySub?.unsubscribe();
  }
}
