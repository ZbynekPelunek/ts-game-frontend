import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SidenavService } from 'src/app/sidenav/sidenav.service';

import { EquipableItem, IArmor, IWeapon } from '../../../../../shared/src';

@Component({
  selector: 'app-equipment-dialog',
  templateUrl: 'equipment-dialog.component.html'
})
export class EquipmentDialogComponent implements OnInit {
  isItemEquipable = false;

  constructor(public dialogRef: MatDialogRef<EquipmentDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: EquipableItem, public sideNavService: SidenavService) { }

  ngOnInit(): void {
    this.isItemEquipable = this.sideNavService.checkEquipableStatus(this.data);
  }

  onEquipClick(): void {
    console.log('onEquipClick() data: ', this.data);
    this.sideNavService.equipCharacter(this.data);
    this.dialogRef.close();
  }

  onUnequipClick(): void {
    console.log('onUnequipClick() data: ', this.data);
    this.sideNavService.unequipCharacter(this.data);
    this.dialogRef.close();
  }

  onSellClick(): void {
    console.log('onSellClick() data: ', this.data);
    this.sideNavService.sellItem(this.data);
    this.dialogRef.close();
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }
}
