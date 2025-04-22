import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CharacterCreateComponent } from './character-create/character-create.component';
import { StarterPageComponent } from './starter-page/starter-page.component';
import { authGuard } from './auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: StarterPageComponent
  },
  {
    path: 'ui/character-create',
    component: CharacterCreateComponent,
    canActivate: [authGuard]
  },
  {
    path: 'ui/auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule)
  },
  {
    path: 'ui/menu',
    loadChildren: () =>
      import('./sidenav/sidenav.module').then((m) => m.SidenavModule),
    canActivate: [authGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
