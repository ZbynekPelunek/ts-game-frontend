import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { AdventuresService } from './adventures.service';
import {
  Adventure,
  CommonItemsEquipmenParams,
  Currency,
  ItemQuality,
  ResultFrontend,
  Reward,
} from '../../../../../../shared/src';
import { MatDialog } from '@angular/material/dialog';
import { ItemDetailsDialogComponent } from 'src/app/dialog/item-details/item-details-dialog.component';
import { ITEM_QUALITY_COLORS } from '../../utils/item-quality.utils';

@Component({
  templateUrl: './adventures.component.html',
  styleUrls: ['./adventures.component.css'],
})
export class AdventuresComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  progressMap: Map<string, number> = new Map();
  progressInterval: NodeJS.Timeout;

  areAdventuresLoading: boolean;

  adventures: Adventure[] = [];
  adventuresInProgress: ResultFrontend[] = [];
  adventureResultsWithoutCollectedRewards: ResultFrontend[] = [];

  constructor(
    private adventuresService: AdventuresService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.areAdventuresLoading = true;

    if (this.adventuresService.characterExists()) {
      this.loadAdventures();
      this.loadAdventuresInProgress();
      this.loadAdventuresRewardNotCollected();
      this.areAdventuresLoading = false;
      this.startProgressUpdates();
    }
  }

  private loadAdventures(): void {
    this.adventuresService
      .getAdventures()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          //console.log('Called adventures: ', response);
          this.adventures = response;
        },
      });
    this.adventuresService.listAdventures({ populateReward: true });
  }

  private loadAdventuresInProgress(): void {
    this.adventuresService
      .getAdventuresInProgress()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          //console.log('List Adventures in progress response: ', response);

          this.adventuresInProgress = response;
        },
      });
    this.adventuresService.checkResults();
    this.adventuresService.startTimersInProgress(this.adventuresInProgress);
  }

  private loadAdventuresRewardNotCollected(): void {
    this.adventuresService
      .getAdventuresUncollectedReward()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          //console.log('loadAdventuresRewardNotCollected response: ', response);

          this.adventureResultsWithoutCollectedRewards = response;
        },
      });
    this.adventuresService.listAdventuresUncollectedRewards();
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
    //console.log(`Starting adventure: ${adventureId}`);
    this.adventuresService.startAdventure(adventureId);
  }

  onCollectReward(result: ResultFrontend) {
    //console.log('Collecting reward: ', result);
    this.adventuresService.collectReward(result._id);
  }

  openItemDetailsDialog(item: CommonItemsEquipmenParams): void {
    this.dialog.open(ItemDetailsDialogComponent, {
      width: '500px',
      data: { item },
    });
  }

  startProgressUpdates(): void {
    this.progressInterval = setInterval(() => {
      this.updateProgress();
    }, 1000);
  }

  updateProgress(): void {
    const now = Date.now();

    this.adventuresInProgress.forEach((adventure) => {
      const finishTime = new Date(adventure.timeFinish).getTime();
      const startTime = new Date(adventure.timeStart).getTime();

      if (now < finishTime) {
        const elapsed = now - startTime;
        const total = finishTime - startTime;
        const progress = Math.round((elapsed / total) * 100);
        this.progressMap.set(adventure._id, progress);
      }
    });
  }

  getItemQualityClass(quality: ItemQuality): string {
    return ITEM_QUALITY_COLORS[quality] || ITEM_QUALITY_COLORS['COMMON'];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    clearInterval(this.progressInterval);
  }
}
