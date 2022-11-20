import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { EquipmentDialogComponent } from 'src/app/dialog/equipment/equipment-dialog.component';

import { EquipmentSlotsArr, ICharacter, Inventory, InventoryItem, ItemType } from '../../../../../../shared/src';
import { SidenavService } from '../../sidenav.service';

@Component({
  selector: 'app-character',
  templateUrl: './character.component.html',
  styleUrls: ['./character.component.css']
})
export class CharacterComponent implements OnInit, OnDestroy {
  private charSub: Subscription;
  dragAndDropAllowed = false;

  inventory: Inventory[];
  equipmentSlots: EquipmentSlotsArr;

  isLoading = false;
  playerCharacter: ICharacter;

  constructor(private sidenavService: SidenavService, public equipmentDialog: MatDialog) { }

  ngOnInit(): void {
    this.isLoading = true;
    console.log('Getting character data...');
    this.sidenavService.getCharacter();
    this.charSub = this.sidenavService.getCharacterUpdateListener().subscribe({
      next: (response) => {
        this.playerCharacter = { ...response.character };
        this.inventory = [...response.character.inventory];
        this.equipmentSlots = [...response.character.equipmentSlots];
        this.isLoading = false;
        console.log('...character data fetched.: ', response);
      }
    });
  }

  openItemDialog(item: InventoryItem): void {
    console.log('item clicked', item);
    if (item.itemType === ItemType.EQUIPMENT) {
      this.equipmentDialog.open(EquipmentDialogComponent, {
        width: '250px',
        data: item
      });
    }
  }

  dropEquipment(_event: CdkDragDrop<EquipmentSlotsArr>): void {
    if (!this.dragAndDropAllowed) {
      return;
    }
  }

  dropInventory(_event: CdkDragDrop<Inventory[]>): void {
    if (!this.dragAndDropAllowed) {
      return;
    }
  }

  ngOnDestroy(): void {
    if (this.charSub) {
      this.charSub.unsubscribe();
    }
  }

  // DRAG AND DROP TEST

  // dropEquipment(event: CdkDragDrop<any>) {
  //   if (!this.dragAndDropAllowed) {
  //     return;
  //   }
  //   console.log('dropEquip event: ', event);
  //   if (event.previousContainer.data[event.previousIndex].item.type !== ItemType.EQUIPMENT) {
  //     return;
  //   }
  //   if (event.previousContainer === event.container) {
  //     const currentData: EquipmentSlots = event.container.data[event.currentIndex];
  //     const previousData: EquipmentSlots = event.previousContainer.data[event.previousIndex];
  //     if (this.isCorrectSlot(previousData.slot, currentData.slot)) {
  //       const currentEquip = currentData.equipment;
  //       const previousEquip = previousData.equipment;
  //       event.container.data[event.currentIndex].equipment = previousEquip;
  //       event.previousContainer.data[event.previousIndex].equipment = currentEquip;
  //     }
  //   } else {
  //     const currentData: EquipmentSlots = event.container.data[event.currentIndex];
  //     const previousData: EquipableItem = event.previousContainer.data[event.previousIndex].item;
  //     console.log('currentData: ', currentData);
  //     console.log('previousData: ', previousData)
  //     if (this.isCorrectSlot(previousData.slot, currentData.slot)) {
  //       const currentEquip = currentData.equipment;
  //       const previousEquip = previousData;
  //       event.container.data[event.currentIndex].equipment = previousEquip;
  //       event.previousContainer.data[event.previousIndex].item = currentEquip;
  //     }
  //   }
  // }

  // dropInventory(event: CdkDragDrop<any>) {
  //   if (!this.dragAndDropAllowed) {
  //     return;
  //   }
  //   console.log('dropInventory event: ', event);
  //   if (!event.isPointerOverContainer) {
  //     return;
  //   }
  //   if (event.previousContainer === event.container) {
  //     if (event.container.data[event.currentIndex].item === null) {
  //       const draggedItem = event.previousContainer.data[event.previousIndex].item;
  //       event.container.data[event.currentIndex].item = { ...draggedItem, positionIndex: event.currentIndex };
  //       event.previousContainer.data[event.previousIndex].item = null;
  //     } else {
  //       const draggedItem = event.container.data[event.currentIndex].item;
  //       const item2 = event.previousContainer.data[event.previousIndex].item;
  //       console.log('dragged item: ', draggedItem);
  //       event.container.data[event.currentIndex].item = { ...item2, positionIndex: event.currentIndex };
  //       event.previousContainer.data[event.previousIndex].item = { ...draggedItem, positionIndex: event.previousIndex };
  //     }

  //   } else {
  //     const itemsArr = event.container.data.map(items => items.item).filter(items => items !== null);
  //     if (itemsArr.length >= event.container.data.length) {
  //       console.log('full inventory');
  //       return;
  //     }
  //     if (event.container.data[event.currentIndex].item === null) {
  //       console.log('moving equipment to inventory');
  //       const draggedEquipment = event.previousContainer.data[event.previousIndex].equipment;
  //       event.container.data[event.currentIndex].item = { ...draggedEquipment, positionIndex: event.currentIndex };
  //       event.previousContainer.data[event.previousIndex].equipment = null;
  //     }
  //   }
  // }

  // isCorrectSlot(previousSlot: EquipmentSlot, currentSlot: EquipmentSlot): boolean {
  //   if (previousSlot === currentSlot) {
  //     console.log(`${previousSlot} can be inserted into ${currentSlot}`)

  //     return true;
  //   } else {
  //     console.log(`${previousSlot} can NOT be inserted into ${currentSlot}`)

  //     return false;
  //   }
  // }

  // /** Predicate function that only allows X to be dropped into a list. */
  // slotPredicate(item: CdkDrag<InventoryItem>) {
  //   console.log('slotPredicate: ', item.data)
  //   return item.data.itemType === ItemType.EQUIPMENT
  // }

  // /** Predicate function that doesn't allow items to be dropped into a list. */
  // noReturnPredicate() {
  //   return false;
  // }
}
