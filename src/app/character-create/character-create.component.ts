import { Component } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { CharacterCreateService } from './character-create.service';

@Component({
  selector: 'app-character-create',
  templateUrl: './character-create.component.html',
  styleUrls: ['./character-create.component.css']
})
export class CharacterCreateComponent {
  isLoading = false;

  constructor(private characterCreateService: CharacterCreateService, private authService: AuthService) { }

  onCreate() {
    this.characterCreateService.create(this.authService.getAccountId());
  }
}
