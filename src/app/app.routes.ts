import { Routes } from '@angular/router';

import { authGuard } from './auth/auth.guard';
import { authRoutes } from './auth/auth.routes';
import { CharacterCreateComponent } from './character-create/character-create.component';
import { sidenavRoutes } from './sidenav/sidenav.routes';
import { StarterPageComponent } from './starter-page/starter-page.component';

export const routes: Routes = [
  { path: '', component: StarterPageComponent },
  {
    path: 'ui/auth',
    children: authRoutes
  },
  {
    path: 'ui/character-create',
    component: CharacterCreateComponent,
    canActivate: [authGuard]
  },
  {
    path: 'ui/menu',
    children: sidenavRoutes
  },
  { path: '**', redirectTo: '' }
];
