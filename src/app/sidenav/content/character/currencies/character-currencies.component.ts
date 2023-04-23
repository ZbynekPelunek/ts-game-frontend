import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

import { CharacterCurrencyFrontend } from '../../../../../../../shared/src';
import { CharacterService } from '../character.service';

@Component({
  selector: 'app-character-currencies',
  templateUrl: './character-currencies.component.html',
  styleUrls: ['./character-currencies.component.css']
})
export class CharacterCurrenciesComponent implements OnInit, OnDestroy {
  @Input() characterId: string;

  isLoading = true;

  characterCurrencies: CharacterCurrencyFrontend[];

  getAllCharCurrenciesSub: Subscription;

  constructor(private characterService: CharacterService) { }

  ngOnInit(): void {
    this.getAllCharCurrenciesSub = this.characterService.getCharacterCurrencies(this.characterId, true).subscribe({
      next: (response) => {
        console.log('character currencies response: ', response);
        if (response.success) {
          this.characterCurrencies = response.characterCurrencies;
          this.isLoading = false;
        }
      }
    })
  }
  ngOnDestroy(): void {
    this.isLoading = true;
    this.getAllCharCurrenciesSub.unsubscribe();
  }
}
