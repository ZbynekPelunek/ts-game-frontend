import { Component, OnInit } from '@angular/core';

import { CharacterCreateService } from './character-create.service';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';
import {
  CharacterClass,
  CharacterRace,
  CreateCharacterRequestDTO
} from '../../../../shared/src';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-character-create',
  templateUrl: './character-create.component.html',
  styleUrls: ['./character-create.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class CharacterCreateComponent implements OnInit {
  characterForm: FormGroup;
  races = [CharacterRace.HUMAN];
  classes = [CharacterClass.WARRIOR];

  constructor(
    private fb: FormBuilder,
    private characterCreateService: CharacterCreateService,
    private snackBar: MatSnackBar,
    private router: Router
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
      const body: CreateCharacterRequestDTO = {
        ...characterData
      };
      this.characterCreateService.createCharacter(body).subscribe({
        next: (response) => {
          if (response.success) {
            this.router.navigate(['/ui/menu/character']);
          }
        },
        error: (err) => {
          this.snackBar.open(err, 'OK', {
            duration: 30000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      });
    }
  }
}
