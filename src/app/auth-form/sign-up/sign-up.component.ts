import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { CharacterCreateService } from 'src/app/character-create/character-create.service';



@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  isLoading = false;

  constructor(public authService: AuthService, private charCreateService: CharacterCreateService) { }

  onSignUp(event: Event): void {
    console.log('event: ', event)
    this.charCreateService.setCharCreatingValue(true);
    this.authService.signUp();
  }
}
