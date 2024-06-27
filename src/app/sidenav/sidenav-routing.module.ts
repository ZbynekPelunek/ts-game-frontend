import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { AdventuresComponent } from './content/adventures/adventures.component';
import { CharacterComponent } from './content/character/character.component';
import { ShopComponent } from './content/shop/shop.component';

const routes: Routes = [
  {
    path: 'ui/menu/character',
    component: CharacterComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ui/menu/adventures',
    component: AdventuresComponent,
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'ui/menu/shop',
  //   component: ShopComponent,
  //   canActivate: [AuthGuard]
  // }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SidenavRoutingModule { }
