import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { AdventuresService } from './adventures.service';
import {
  Adventure,
  CommonItemsEquipmenParams,
  Currency,
  ResultFrontend,
  Reward,
} from '../../../../../../shared/src';
import { CharacterCreateService } from 'src/app/character-create/character-create.service';

@Component({
  templateUrl: './adventures.component.html',
  styleUrls: ['./adventures.component.css'],
})
export class AdventuresComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private adventureCheckInterval: any;

  areAdventuresLoading: boolean;

  adventures: Adventure[] = [];
  adventuresInProgress: ResultFrontend[] = [];
  adventureResultsWithoutCollectedRewards: ResultFrontend[] = [];

  characterId: string;

  constructor(
    private adventuresService: AdventuresService,
    private characterCreateService: CharacterCreateService
  ) {}

  ngOnInit(): void {
    this.characterId = this.characterCreateService.getCharacterId();
    this.areAdventuresLoading = true;

    this.loadAdventures();

    this.loadAdventuresInProgress();
    this.loadAdventuresRewardNotCollected();

    this.adventureCheckInterval = setInterval(() => {
      this.adventuresService
        .checkResults()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            console.log('Check results response: ', response);
            if (response.success) {
              this.loadAdventuresInProgress();
              this.loadAdventuresRewardNotCollected();
            }
          },
        });
    }, 5000);
  }

  private loadAdventures(): void {
    this.adventuresService
      .listAdventures(true)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Called adventures: ', response);
          if (response.success) {
            this.adventures = response.adventures;
            this.areAdventuresLoading = false;
          }
        },
      });
  }

  private loadAdventuresInProgress(): void {
    this.adventuresService
      .listResults(this.characterId, true)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('List Results response: ', response);
          if (response.success) {
            this.adventuresInProgress = response.results;
          }
        },
      });
  }

  private loadAdventuresRewardNotCollected(): void {
    this.adventuresService
      .listResults(this.characterId, undefined, false)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('loadAdventuresRewardNotCollected response: ', response);
          if (response.success) {
            this.adventureResultsWithoutCollectedRewards = response.results;
          }
        },
      });
  }

  isReward(rewardId: number | Reward): rewardId is Reward {
    return (rewardId as Reward)._id !== undefined;
  }

  isCurrency(currencyId: number | Currency): currencyId is Currency {
    return (currencyId as Currency)._id !== undefined;
  }

  isItem(
    itemId: number | CommonItemsEquipmenParams
  ): itemId is CommonItemsEquipmenParams {
    return (itemId as CommonItemsEquipmenParams).itemId !== undefined;
  }

  onStartAdventure(adventureId: number) {
    const adventureArrIndex = this.adventures.findIndex(
      (a) => a._id === adventureId
    );

    if (adventureArrIndex === -1) {
      console.error('Adventure not found');
      return;
    }

    console.log(
      `Starting adventure: ${adventureId} with character: ${this.characterId}`
    );
    this.adventuresService
      .postResult(adventureId, this.characterId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('POST Result response: ', response);
          this.loadAdventuresInProgress();
        },
        error: (err) => {
          console.error('Failed to start adventure:', err);
        },
      });

    console.log('Adventures in progress: ', this.adventuresInProgress);
  }

  onCollectReward(result) {
    console.log('Collecting reward: ', result);
    this.adventuresService
      .collectReward(result._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Collect Reward response: ', response);
          this.loadAdventuresRewardNotCollected();
        },
        error: (err) => {
          console.error('Failed to collected reward:', err);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearInterval(this.adventureCheckInterval);
  }
}
