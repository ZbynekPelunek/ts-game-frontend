import { Routes } from '@angular/router';

import { authGuard } from '../auth/auth.guard';
import { AdventuresComponent } from './content/adventures/adventures.component';
import { CharacterComponent } from './content/character/character.component';
import { SidenavComponent } from './sidenav.component';

export const sidenavRoutes: Routes = [
  {
    path: '',
    component: SidenavComponent,
    canActivate: [authGuard],
    children: [
      { path: 'character', component: CharacterComponent },
      { path: 'adventures', component: AdventuresComponent }
    ]
  }
];
