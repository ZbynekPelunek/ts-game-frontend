import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  Adventure,
  ApiRoutes,
  ListAdventuresRequestQuery,
  ListResultsRequestQuery,
  CreateResultRequestBody,
  ListAdventuresResponse,
  ListResultsResponse,
  CreateResultResponse,
  ResultDTO,
  ResultFrontend,
  ResultGetActions,
  ResultPatchActions,
  ResultState
} from '../../../../../../shared/src';
import { BehaviorSubject } from 'rxjs';
import { CharacterCreateService } from 'src/app/character-create/character-create.service';
import { AdventureEvents, EventBusService } from 'src/app/eventBus.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/auth/auth.service';
import { CharacterService } from '../character/character.service';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class AdventuresService implements OnDestroy {
  private characterId: string;
  private adventuresSubject = new BehaviorSubject<Adventure[]>([]);
  private adventuresInProgressSubject = new BehaviorSubject<ResultFrontend[]>(
    []
  );
  private adventuresUncollectedRewardSubject = new BehaviorSubject<
    ResultFrontend[]
  >([]);
  private timers = new Map<string, NodeJS.Timeout>();
  progressMap: Map<string, number> = new Map();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private eventBus: EventBusService,
    private snackBar: MatSnackBar,
    private characterService: CharacterService
  ) {
    this.characterService.currentCharacterId$.subscribe({
      next: (id) => {
        this.characterId = id;

        if (id) {
          this.eventBus.getEvents().subscribe((event) => {
            switch (event) {
              case AdventureEvents.REFRESH_INPROGRESS:
                this.listAdventuresInProgress();
                break;
              case AdventureEvents.REFRESH_UNCOLLECTED_REWARDS:
                this.listAdventuresUncollectedRewards();
                break;
              case AdventureEvents.REFRESH_ADVENTURES:
                this.listAdventures({ populateReward: 'true' });
            }
          });
        }
      }
    });
  }

  getAdventures() {
    return this.adventuresSubject.asObservable();
  }

  getAdventuresInProgress() {
    return this.adventuresInProgressSubject.asObservable();
  }

  getAdventuresUncollectedReward() {
    return this.adventuresUncollectedRewardSubject.asObservable();
  }

  listAdventures(query: ListAdventuresRequestQuery): void {
    let params = new HttpParams();

    for (const key in query) {
      if (query.hasOwnProperty(key) && query[key] !== undefined) {
        params = params.set(key, String(query[key]));
      }
    }

    this.http
      .get<ListAdventuresResponse>(`${BACKEND_URL}/${ApiRoutes.ADVENTURES}`, {
        params,
        withCredentials: true
      })
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.adventuresSubject.next(response.adventures);
          }
        }
      });
  }

  listResults(query: ListResultsRequestQuery) {
    let params = new HttpParams();
    const { characterId, state } = query;

    if (characterId) {
      params = params.append('characterId', characterId);
    }

    if (state) {
      params = params.append('state', state);
    }

    return this.http.get<ListResultsResponse>(
      `${BACKEND_URL}/${ApiRoutes.RESULTS}`,
      {
        params,
        withCredentials: true
      }
    );
  }

  listAdventuresInProgress() {
    this.listResults({
      characterId: this.characterId,
      state: ResultState.IN_PROGRESS
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.adventuresInProgressSubject.next(response.results);
        }
      }
    });
  }

  listAdventuresUncollectedRewards() {
    this.listResults({
      characterId: this.characterId,
      state: ResultState.FINISHED
    }).subscribe({
      next: (response) => {
        if (response.success) {
          this.adventuresUncollectedRewardSubject.next(response.results);
        }
      }
    });
  }

  finishResult(resultId: string) {
    this.http
      .patch<{
        success: boolean;
      }>(
        `${BACKEND_URL}/${ApiRoutes.RESULTS}/${resultId}/${ResultPatchActions.FINISH_RESULT}`,
        null,
        {
          withCredentials: true
        }
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.eventBus.emitEvent(AdventureEvents.REFRESH_INPROGRESS);
            this.eventBus.emitEvent(
              AdventureEvents.REFRESH_UNCOLLECTED_REWARDS
            );
            this.progressMap.delete(resultId);
          }
        }
      });
  }

  cancelAdventure(resultId: string) {
    return this.http
      .patch<{
        success: boolean;
      }>(
        `${BACKEND_URL}/${ApiRoutes.RESULTS}/${resultId}/${ResultPatchActions.CANCEL_ADVENTURE}`,
        null,
        {
          withCredentials: true
        }
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.eventBus.emitEvent(AdventureEvents.REFRESH_INPROGRESS);
            this.eventBus.emitEvent(
              AdventureEvents.REFRESH_UNCOLLECTED_REWARDS
            );
            if (this.timers.has(resultId)) {
              const timer = this.timers.get(resultId);
              clearTimeout(timer);
              this.timers.delete(resultId);
              this.progressMap.delete(resultId);
            }
          }
        },
        error: (err) => {
          console.error('Error creating character', err);
        }
      });
  }

  skipAdventure(result: ResultFrontend) {
    const resultId = result._id;

    return this.http
      .patch<{
        success: boolean;
      }>(
        `${BACKEND_URL}/${ApiRoutes.RESULTS}/${resultId}/${ResultPatchActions.SKIP_ADVENTURE}`,
        null,
        {
          withCredentials: true
        }
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.eventBus.emitEvent(AdventureEvents.REFRESH_INPROGRESS);
            if (this.timers.has(resultId)) {
              const timer = this.timers.get(resultId);
              this.finishResult(resultId);
              clearTimeout(timer);
              this.timers.delete(resultId);
            }
          }
        }
      });
  }

  checkResults() {
    this.http
      .patch(
        `${BACKEND_URL}/${ApiRoutes.RESULTS}/${ResultGetActions.CHECK_IN_PROGRESS}`,
        {
          characterId: this.characterId
        },
        {
          withCredentials: true
        }
      )
      .subscribe({
        next: () => {
          this.eventBus.emitEvent(AdventureEvents.REFRESH_INPROGRESS);
          this.eventBus.emitEvent(AdventureEvents.REFRESH_UNCOLLECTED_REWARDS);
        }
      });
  }

  collectReward(resultId: string) {
    return this.http
      .patch<{
        success: boolean;
      }>(
        `${BACKEND_URL}/${ApiRoutes.RESULTS}/${resultId}/${ResultPatchActions.COLLECT_REWARD}`,
        null,
        {
          withCredentials: true
        }
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.eventBus.emitEvent(
              AdventureEvents.REFRESH_UNCOLLECTED_REWARDS
            );
          }
        },
        error: (err) => {
          this.snackBar.open(err.error.error, 'OK');
        }
      });
  }

  startAdventure(adventureId: number) {
    const resultBody: CreateResultRequestBody = {
      adventureId,
      characterId: this.characterId
    };

    this.http
      .post<CreateResultResponse>(
        `${BACKEND_URL}/${ApiRoutes.RESULTS}`,
        resultBody,
        {
          withCredentials: true
        }
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.startAdventureTimer(response.result);
          }
          this.eventBus.emitEvent(AdventureEvents.REFRESH_INPROGRESS);
        }
      });
  }

  startAdventureTimer(result: ResultDTO) {
    const { resultId, timeFinish } = result;

    const finishDate = new Date(timeFinish).getTime();
    const now = Date.now();

    const timeoutDuration = finishDate - now;

    if (this.timers.has(resultId)) {
      //console.warn(`Timer already exists for adventure: ${resultId}`);
      if (timeoutDuration <= 0) {
        this.finishResult(resultId);
        this.timers.delete(resultId);
      }
      return;
    }

    if (timeoutDuration > 0) {
      const timer = setTimeout(() => {
        this.finishResult(resultId);
        this.timers.delete(resultId);
      }, timeoutDuration);

      this.timers.set(resultId, timer);
    } else {
      this.finishResult(resultId);
    }
  }

  startTimersInProgress(results: ResultFrontend[]) {
    const resultsDto: ResultDTO[] = results.map((r) => {
      return {
        ...r,
        resultId: r._id,
        timeFinish: r.timeFinish,
        timeStart: r.timeStart
      };
    });

    resultsDto.forEach((result) => {
      this.startAdventureTimer(result);
    });
  }

  characterExists(): boolean {
    return this.characterId ? true : false;
  }

  ngOnDestroy(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.timers.clear();
  }
}
