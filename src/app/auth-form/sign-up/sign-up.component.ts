import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';



@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  isLoading = false;

  constructor(public authService: AuthService) { }

  onSignUp(event: Event): void {
    console.log('event: ', event)
    this.authService.signUp();
  }
}
