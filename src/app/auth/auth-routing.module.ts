import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthFormComponent } from '../auth-form/auth-form.component';
import { SignUpComponent } from '../auth-form/sign-up/sign-up.component';

const routes: Routes = [
  {
    path: 'login',
    component: AuthFormComponent
  },
  {
    path: 'signup',
    component: SignUpComponent
  }
]

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
