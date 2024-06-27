import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CharacterInventoryService } from './character-inventory.service';
import { Subscription } from 'rxjs';
import { InventoryFrontend } from '../../../../../../../shared/src';

@Component({
  selector: 'app-character-inventory',
  templateUrl: './character-inventory.component.html',
  styleUrls: ['./character-inventory.component.css']
})
export class CharacterInventoryComponent implements OnInit, OnDestroy {
  @Input() characterId: string;
  private inventorySub: Subscription;
  inventorySlots: InventoryFrontend[] = [];

  isLoading = true;

  constructor(private characterInventoryService: CharacterInventoryService) { }

  ngOnInit(): void {
    this.isLoading = true;
    console.log('Getting inventory data...');
    this.inventorySub = this.characterInventoryService.listInventorySlots(this.characterId).subscribe({
      next: (response) => {
        console.log('...inventory data fetched.: ', response);
        if (response.success) {
          this.inventorySlots = response.inventory;
           this.isLoading = false;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.inventorySub?.unsubscribe();
  }
}