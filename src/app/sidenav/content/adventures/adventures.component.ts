import { Component, OnDestroy, OnInit } from '@angular/core';

import { AdventuresService } from './adventures.service';
import {
  Adventure,
  CommonItemsEquipmenParams,
  Currency,
  Reward,
} from '../../../../../../shared/src';
import { Subscription } from 'rxjs';
import { CharacterCreateService } from 'src/app/character-create/character-create.service';

@Component({
  templateUrl: './adventures.component.html',
  styleUrls: ['./adventures.component.css'],
})
export class AdventuresComponent implements OnInit, OnDestroy {
  private adventuresSub: Subscription;
  // private adventureResultSub: Subscription;
  // private charAdvsSub: Subscription;
  // private charUpdateSub: Subscription;

  areAdventuresLoading: boolean;

  // adventureState_Idle = AdventureState.IDLE
  // adventureState_InProgress = AdventureState.IN_PROGRESS;
  // adventureState_Finished = AdventureState.FINISHED;
  // adventureState = this.adventureState_Idle;

  adventures: Adventure[] = [];

  characterId: string;
  // playerCharacter: { characterId: string; level: number };

  // displayedColumns: string[] = ['statName', 'statValue'];

  constructor(
    private adventuresService: AdventuresService,
    private characterCreateService: CharacterCreateService
  ) {}

  ngOnInit(): void {
    this.characterId = this.characterCreateService.getCharacterId();
    this.areAdventuresLoading = true;
    this.adventuresSub = this.adventuresService.listAdventures(true).subscribe({
      next: (response) => {
        console.log('Called adventures: ', response);
        if (response.success) {
          this.adventures = response.adventures;
          this.areAdventuresLoading = false;
        }
      },
    });
    // this.sidenavService.getCharacterAdventures();
    // this.charAdvsSub = this.sidenavService.getCharacterAdventuresUpdateListener().subscribe({
    //   next: (response) => {
    //     this.adventures = [...response.adventures.filter(a => a.adventureState !== AdventureState.FINISHED)];

    //     this.areAdventuresLoading = false;
    //   }
    // })
    // this.isCharacterLoading = true;
    // //this.sidenavService.getCharacter();
    // this.charUpdateSub = this.sidenavService.getCharacterUpdateListener().subscribe({
    //   next: (response) => {
    //     this.playerCharacter = {
    //       characterId: response.character.characterId,
    //       level: response.character.level
    //     }

    //     this.isCharacterLoading = false;
    //   }
    // })
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
    console.log(
      `Starting adventure: ${adventureId} with character: ${this.characterId}`
    );
    this.adventuresService.postResult(adventureId, this.characterId);
    // this.adventureStartSub = this.sidenavService.startAdventure(adventureId, this.playerCharacter.characterId).subscribe({
    //   next: (response) => {
    //     console.log(response.message);
    //     const adventure = this.adventures[this.adventures.findIndex((a) => a.adventureId === adventureId)];
    //     adventure.timer = {
    //       ...adventure.timer,
    //       progressPercent: 100,
    //       timeLeft: adventure.timeInSeconds
    //     }
    //     this.sidenavService.getCharacterAdventures();
    //     // this.adventureState = AdventureState.IN_PROGRESS;
    //     adventure.intervalId = setInterval(() => {
    //       adventure.timer.timeLeft = new Date(response.result.timeFinished).getTime() - new Date().getTime();
    //       console.log(adventure.timer.timeLeft);
    //       adventure.timer.progressPercent = (100 * adventure.timer.timeLeft) / (adventure.timeInSeconds * 1000);
    //       if (adventure.timer.timeLeft <= 0) {
    //         console.log('adventure done');
    //         this.adventureResultSub = this.sidenavService.getAdventureResult(response.result.resultId).subscribe({
    //           next: (result) => {
    //             console.log(result);
    //             console.log(this.adventures);
    //             this.sidenavService.getCharacterAdventures();
    //           }
    //         });
    //         clearInterval(adventure.intervalId);

    //         // SHOW isAttacking TEMPLATE WITH PLAYER VS ENEMY
    //         // AdventureState.FINISHED -> AdventureState.IDLE
    //       }
    //     }, 1000);
    //   }
    // })
  }

  ngOnDestroy(): void {
    this.adventuresSub ?? this.adventuresSub.unsubscribe();
    // this.charAdvsSub.unsubscribe();
    // if (this.adventureStartSub) {
    //   this.adventureStartSub.unsubscribe();
    // };
    // if (this.adventureResultSub) {
    //   this.adventureResultSub.unsubscribe();
    // };
    // if (this.charUpdateSub) {
    //   this.charUpdateSub.unsubscribe();
    // };
  }
}
