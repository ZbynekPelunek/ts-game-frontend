import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AngularMaterialModule } from '../angular-material.module';
import { EquipmentDialogComponent } from './equipment/equipment-dialog.component';

@NgModule({
  declarations: [EquipmentDialogComponent],
  imports: [CommonModule, AngularMaterialModule],
  exports: [EquipmentDialogComponent]
})
export class CharDialogModule { }
