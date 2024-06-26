import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AngularMaterialModule } from '../angular-material.module';
import { CharDialogModule } from '../dialog/char-dialog.module';
import { AdventuresComponent } from './content/adventures/adventures.component';
import { ArenaComponent } from './content/arena/arena.component';
import {
  CharacterDetailsComponent,
} from './content/character/character-details/character-details.component';
import { CharacterComponent } from './content/character/character.component';
import {
  CharacterCurrenciesComponent,
} from './content/character/currencies/character-currencies.component';
import {
  CharacterEquipmentComponent,
} from './content/character/equipment/character-equipment.component';
import { DashboardComponent } from './content/dashboard/dashboard.component';
import { SidenavRoutingModule } from './sidenav-routing.module';
import { CharacterInventoryComponent } from './content/character/inventory/character-inventory.component';

@NgModule({
  declarations: [
    DashboardComponent,
    CharacterComponent,
    ArenaComponent,
    AdventuresComponent,
    CharacterDetailsComponent,
    CharacterCurrenciesComponent,
    CharacterEquipmentComponent,
    CharacterInventoryComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    SidenavRoutingModule,
    FormsModule,
    DragDropModule,
    CharDialogModule,
    ScrollingModule
  ]
})
export class SidenavModule { }
