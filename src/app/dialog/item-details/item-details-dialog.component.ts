// item-details-dialog.component.ts
import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import {
  Armor,
  ArmorType,
  CommonItemParams,
  CommonItemsEquipmenParams,
  Weapon,
  WeaponType
} from '../../../../../shared/src';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-item-details-dialog',
  templateUrl: './item-details-dialog.component.html',
  styleUrls: ['./item-details-dialog.component.scss'],
  imports: [CommonModule, MatDialogModule]
})
export class ItemDetailsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ItemDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: CommonItemsEquipmenParams }
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  isEquipment(item: CommonItemParams): item is Armor | Weapon {
    return (item as Armor | Weapon).itemLevel !== undefined;
  }

  isArmor(item: CommonItemsEquipmenParams): boolean {
    return Object.values(ArmorType).includes(item.equipmentType as ArmorType);
  }

  isWeapon(item: CommonItemsEquipmenParams): boolean {
    return Object.values(WeaponType).includes(item.equipmentType as WeaponType);
  }
}
