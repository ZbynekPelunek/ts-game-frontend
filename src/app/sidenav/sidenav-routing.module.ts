import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../auth/auth.guard';
import { AdventuresComponent } from './content/adventures/adventures.component';
import { CharacterComponent } from './content/character/character.component';
import { ShopComponent } from './content/shop/shop.component';

//import { ArenaComponent } from './content/arena/arena.component';
//import { DashboardComponent } from './content/dashboard/dashboard.component';
//import { FortuneComponent } from './content/fortune/fortune.component';
const routes: Routes = [
  // {
  //   path: 'dashboard',
  //   component: DashboardComponent,
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'character',
    component: CharacterComponent,
    canActivate: [AuthGuard]
  },
  // {
  //   path: 'fortune',
  //   component: FortuneComponent,
  //   canActivate: [AuthGuard]
  // },
  // {
  //   path: 'arena',
  //   component: ArenaComponent,
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'adventures',
    component: AdventuresComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'shop',
    component: ShopComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class SidenavRoutingModule { }
