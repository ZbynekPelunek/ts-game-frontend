import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './auth/auth.guard';
import { CharacterCreateComponent } from './character-create/character-create.component';
import { StarterPageComponent } from './starter-page/starter-page.component';

const routes: Routes = [
  {
    path: '',
    component: StarterPageComponent
  },
  {
    path: 'ui/character-create',
    component: CharacterCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ui/auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'ui/menu', loadChildren: () => import('./sidenav/sidenav.module').then(m => m.SidenavModule), canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
