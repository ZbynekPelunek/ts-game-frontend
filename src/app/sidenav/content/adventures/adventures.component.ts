import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import {
  AdventureState,
  IAdventure,
} from '../../../../../../shared/src/interface/adventures.interface';
import { SidenavService } from '../../sidenav.service';

interface AdventureCard extends IAdventure {
  intervalId?: NodeJS.Timer;
}

@Component({
  templateUrl: './adventures.component.html',
  styleUrls: ['./adventures.component.css']
})
export class AdventuresComponent implements OnInit, OnDestroy {
  private adventureStartSub: Subscription;
  private adventureResultSub: Subscription;
  private charAdvsSub: Subscription;
  private charUpdateSub: Subscription;

  areAdventuresLoading: boolean = true;
  isCharacterLoading: boolean = true;

  adventureState_Idle = AdventureState.IDLE
  adventureState_InProgress = AdventureState.IN_PROGRESS;
  adventureState_Finished = AdventureState.FINISHED;
  adventureState = this.adventureState_Idle;

  adventures: AdventureCard[] = [];

  playerCharacter: { characterId: string; level: number };

  displayedColumns: string[] = ['statName', 'statValue'];

  constructor(private sidenavService: SidenavService) { }

  ngOnInit(): void {
    this.areAdventuresLoading = true;
    this.sidenavService.getCharacterAdventures();
    this.charAdvsSub = this.sidenavService.getCharacterAdventuresUpdateListener().subscribe({
      next: (response) => {
        this.adventures = [...response.adventures.filter(a => a.adventureState !== AdventureState.FINISHED)];

        this.areAdventuresLoading = false;
      }
    })
    this.isCharacterLoading = true;
    //this.sidenavService.getCharacter();
    this.charUpdateSub = this.sidenavService.getCharacterUpdateListener().subscribe({
      next: (response) => {
        this.playerCharacter = {
          characterId: response.character.characterId,
          level: response.character.level
        }

        this.isCharacterLoading = false;
      }
    })
  }

  onStartAdventure(adventureId: string) {
    //this.sidenavService.startAdventure(adventureId, this.playerCharacter.characterId);
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
    this.charAdvsSub.unsubscribe();
    if (this.adventureStartSub) {
      this.adventureStartSub.unsubscribe();
    };
    if (this.adventureResultSub) {
      this.adventureResultSub.unsubscribe();
    };
    if (this.charUpdateSub) {
      this.charUpdateSub.unsubscribe();
    };
  }
}
