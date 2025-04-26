// item-details-dialog.component.ts
import { Component, Inject, OnInit } from '@angular/core';
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
import { CharacterCurrenciesService } from 'src/app/sidenav/content/character/currencies/character-currencies.service';

@Component({
  standalone: true,
  selector: 'app-item-details-dialog',
  templateUrl: './item-details-dialog.component.html',
  styleUrls: ['./item-details-dialog.component.scss'],
  imports: [CommonModule, MatDialogModule]
})
export class ItemDetailsDialogComponent implements OnInit {
  currencyLabel = '';

  constructor(
    private characterCurrenciesService: CharacterCurrenciesService,
    public dialogRef: MatDialogRef<ItemDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { item: CommonItemsEquipmenParams }
  ) {}

  ngOnInit(): void {
    this.setCurrencyLabel();
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  setCurrencyLabel() {
    const currencyId = this.characterCurrenciesService.getCachedCurrency(
      this.data.item.sell.currencyId
    );
    this.currencyLabel = currencyId.label;
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
