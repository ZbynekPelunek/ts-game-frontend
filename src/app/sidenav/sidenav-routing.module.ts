import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from '../auth/auth.guard';
import { AdventuresComponent } from './content/adventures/adventures.component';
import { CharacterComponent } from './content/character/character.component';

const routes: Routes = [
  {
    path: 'ui/menu/character',
    component: CharacterComponent,
    canActivate: [authGuard]
  },
  {
    path: 'ui/menu/adventures',
    component: AdventuresComponent,
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SidenavRoutingModule {}
