import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { CharacterInventoryService } from './character-inventory.service';
import { Subject, takeUntil } from 'rxjs';
import {
  CommonItemParams,
  InventoryFrontend,
  InventoryItem
} from '../../../../../../../shared/src';
import { ItemDetailsDialogComponent } from 'src/app/dialog/item-details/item-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  standalone: true,
  selector: 'app-character-inventory',
  templateUrl: './character-inventory.component.html',
  styleUrls: ['./character-inventory.component.scss'],
  imports: [CommonModule, MatProgressSpinnerModule, MatTabsModule]
})
export class CharacterInventoryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() characterId: string;
  inventorySlots: InventoryFrontend[] = [];

  isLoading = true;

  selectedItem: InventoryItem = null;

  constructor(
    private characterInventoryService: CharacterInventoryService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    console.log('Getting inventory data...');
    this.characterInventoryService
      .getInventory()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('...inventory data fetched.: ', response);

          this.inventorySlots = response;
          this.isLoading = false;
        }
      });
    this.characterInventoryService.listInventorySlots({
      characterId: this.characterId,
      populateItem: 'true'
    });
  }

  // Listen for clicks outside of the inventory options
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const clickedInside =
      target.closest('.inventory-slot-item') ||
      target.closest('.inventory-options');

    if (!clickedInside) {
      this.selectedItem = null;
    }
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

  onEquip(inventorySlotId: string) {
    this.characterInventoryService.equipItemFromInventory({
      inventoryId: inventorySlotId
    });
  }

  onSell(inventorySlotId: string) {
    this.characterInventoryService.sellItem({
      inventorySlotId
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
