import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  Adventure,
  ApiRoutes,
  Request_Adventure_GET_all_query,
  Request_Result_GET_all_query,
  Request_Result_POST_body,
  Response_Adventure_GET_all,
  Response_Result_GET_all,
  Response_Result_POST,
  ResultDTO,
  ResultFrontend,
} from '../../../../../../shared/src';
import { BehaviorSubject } from 'rxjs';
import { CharacterCreateService } from 'src/app/character-create/character-create.service';
import { AdventureEvents, EventBusService } from 'src/app/eventBus.service';

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

  constructor(
    private http: HttpClient,
    private characterCreateService: CharacterCreateService,
    private eventBus: EventBusService
  ) {
    this.characterId = characterCreateService.getCharacterId();
    this.eventBus.getEvents().subscribe((event) => {
      switch (event) {
        case AdventureEvents.REFRESH_INPROGRESS:
          this.listAdventuresInProgress();
          break;
        case AdventureEvents.REFRESH_UNCOLLECTED_REWARDS:
          this.listAdventuresUncollectedRewards();
          break;
        case AdventureEvents.REFRESH_ADVENTURES:
          this.listAdventures({ populateReward: true });
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

  listAdventures(query: Request_Adventure_GET_all_query): void {
    let params = new HttpParams();

    for (const key in query) {
      if (query.hasOwnProperty(key) && query[key] !== undefined) {
        params = params.set(key, String(query[key]));
      }
    }

    this.http
      .get<Response_Adventure_GET_all>(
        `${BACKEND_URL}/${ApiRoutes.ADVENTURES}`,
        {
          params,
        }
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.adventuresSubject.next(response.adventures);
          }
        },
      });
  }

  listResults(query: Request_Result_GET_all_query) {
    let params = new HttpParams();
    const { characterId, inProgress, rewardCollected } = query;

    if (characterId) {
      params = params.append('characterId', characterId);
    }

    if (inProgress !== undefined) {
      params = params.append('inProgress', String(inProgress));
    }

    if (rewardCollected !== undefined) {
      params = params.append('rewardCollected', String(rewardCollected));
    }

    return this.http.get<Response_Result_GET_all>(
      `${BACKEND_URL}/${ApiRoutes.RESULTS}`,
      {
        params,
      }
    );
  }

  listAdventuresInProgress() {
    this.listResults({
      characterId: this.characterId,
      inProgress: true,
    }).subscribe({
      next: (response) => {
        if (response.success) {
          //console.log('listAdventuresInProgress response: ', response.results);
          this.adventuresInProgressSubject.next(response.results);
        }
      },
    });
  }

  listAdventuresUncollectedRewards() {
    this.listResults({
      characterId: this.characterId,
      rewardCollected: false,
      inProgress: false,
    }).subscribe({
      next: (response) => {
        if (response.success) {
          console.log(
            'listAdventuresUncollectedRewards response: ',
            response.results
          );
          this.adventuresUncollectedRewardSubject.next(response.results);
        }
      },
    });
  }

  finishResult(resultId: string) {
    this.http
      .patch<{
        success: boolean;
      }>(`${BACKEND_URL}/${ApiRoutes.RESULTS}/${resultId}/finish-result`, null)
      .subscribe({
        next: (response) => {
          if (response.success) {
            this.eventBus.emitEvent(AdventureEvents.REFRESH_INPROGRESS);
            this.eventBus.emitEvent(
              AdventureEvents.REFRESH_UNCOLLECTED_REWARDS
            );
          }
        },
      });
  }

  checkResults() {
    this.http
      .get(`${BACKEND_URL}/${ApiRoutes.RESULTS}/check-in-progress`)
      .subscribe({
        next: () => {
          this.eventBus.emitEvent(AdventureEvents.REFRESH_INPROGRESS);
          this.eventBus.emitEvent(AdventureEvents.REFRESH_UNCOLLECTED_REWARDS);
        },
      });
  }

  collectReward(resultId: string) {
    return this.http
      .get<{
        success: boolean;
        finishedResults: any[];
      }>(`${BACKEND_URL}/${ApiRoutes.RESULTS}/${resultId}/collect-reward`)
      .subscribe({
        next: (response) => {
          //console.log('Collect Reward response: ', response);
          this.eventBus.emitEvent(AdventureEvents.REFRESH_UNCOLLECTED_REWARDS);
        },
      });
  }

  startAdventure(adventureId: number) {
    const resultBody: Request_Result_POST_body = {
      adventureId,
      characterId: this.characterId,
    };

    this.http
      .post<Response_Result_POST>(
        `${BACKEND_URL}/${ApiRoutes.RESULTS}`,
        resultBody
      )
      .subscribe({
        next: (response) => {
          //console.log('POST Result response: ', response);
          if (response.success) {
            this.startAdventureTimer(response.result);
          }
          this.eventBus.emitEvent(AdventureEvents.REFRESH_INPROGRESS);
        },
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
      console.log(
        `Setting timer for adventure: ${resultId}, duration: ${timeoutDuration}ms`
      );
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
        timeStart: r.timeStart,
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
