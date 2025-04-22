import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AngularMaterialModule } from '../angular-material.module';
import { AdventuresComponent } from './content/adventures/adventures.component';
import { ArenaComponent } from './content/arena/arena.component';
import { CharacterAttributesComponent } from './content/character/character-attributes/character-attributes.component';
import { CharacterComponent } from './content/character/character.component';
import { CharacterCurrenciesComponent } from './content/character/currencies/character-currencies.component';
import { CharacterEquipmentComponent } from './content/character/equipment/character-equipment.component';
import { DashboardComponent } from './content/dashboard/dashboard.component';
import { SidenavRoutingModule } from './sidenav-routing.module';
import { CharacterInventoryComponent } from './content/character/inventory/character-inventory.component';
import { ItemDetailsDialogComponent } from '../dialog/item-details/item-details-dialog.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CharacterComponent,
    ArenaComponent,
    AdventuresComponent,
    CharacterAttributesComponent,
    CharacterCurrenciesComponent,
    CharacterEquipmentComponent,
    CharacterInventoryComponent,
    ItemDetailsDialogComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    SidenavRoutingModule,
    FormsModule,
    DragDropModule,
    ScrollingModule,
    MatProgressBarModule
  ]
})
export class SidenavModule {}
