import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/internal/Subscription';

import { CharacterCurrencyFrontend } from '../../../../../../../shared/src';
import { CharacterCurrenciesService } from './character-currencies.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-character-currencies',
  templateUrl: './character-currencies.component.html',
  styleUrls: ['./character-currencies.component.css'],
})
export class CharacterCurrenciesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() characterId: string;

  isLoading = true;

  characterCurrencies: CharacterCurrencyFrontend[];

  getAllCharCurrenciesSub: Subscription;

  constructor(private characterCurrenciesService: CharacterCurrenciesService) {}

  ngOnInit(): void {
    this.characterCurrenciesService
      .getCurrencies()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('character currencies response: ', response);
          this.characterCurrencies = response;
          this.isLoading = false;
        },
      });
    this.characterCurrenciesService.listCharacterCurrencies({
      characterId: this.characterId,
      populateCurrency: true,
    });
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
