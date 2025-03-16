import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { CharacterCreateService } from './character-create.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  CharacterClass,
  CharacterRace,
  Request_Character_POST_body
} from '../../../../shared/src';

@Component({
  selector: 'app-character-create',
  templateUrl: './character-create.component.html',
  styleUrls: ['./character-create.component.css']
})
export class CharacterCreateComponent implements OnInit {
  characterForm: FormGroup;
  races = [CharacterRace.HUMAN]; // List of available races (can be extended)
  classes = [CharacterClass.WARRIOR]; // List of available classes (can be extended)

  constructor(
    private fb: FormBuilder,
    private characterCreateService: CharacterCreateService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.characterForm = this.fb.group({
      race: [this.races[0], Validators.required],
      characterClass: [this.classes[0], Validators.required],
      name: ['', Validators.required]
    });
  }

  createCharacter(): void {
    if (this.characterForm.valid) {
      const characterData = this.characterForm.value;
      const body: Request_Character_POST_body = {
        ...characterData,
        accountId: this.authService.getAccountId()
      };
      this.characterCreateService.createCharacter(body);
    }
  }
}
