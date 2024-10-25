import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  ApiRoutes,
  Request_Adventure_GET_all_query,
  Request_Result_GET_all_query,
  Request_Result_POST_body,
  Response_Adventure_GET_all,
  Response_Result_GET_all,
  Response_Result_POST,
} from '../../../../../../shared/src';
import { Observable } from 'rxjs';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class AdventuresService {
  constructor(private http: HttpClient) {}

  listAdventures(
    populateReward?: boolean
  ): Observable<Response_Adventure_GET_all> {
    const queryString: Request_Adventure_GET_all_query = {};

    if (populateReward) queryString.populateReward = populateReward;

    return this.http.get<Response_Adventure_GET_all>(
      `${BACKEND_URL}/${ApiRoutes.ADVENTURES}`,
      { params: queryString as HttpParams }
    );
  }

  listResults(
    characterId: string,
    inProgress?: boolean,
    rewardCollected?: boolean
  ) {
    let params = new HttpParams();

    params = params.append('characterId', characterId);
    if (inProgress !== undefined) {
      params = params.append('inProgress', String(inProgress));
    }

    if (rewardCollected !== undefined) {
      params = params.append('rewardCollected', String(rewardCollected));
    }

    return this.http.get<Response_Result_GET_all>(
      `${BACKEND_URL}/${ApiRoutes.RESULTS}`,
      { params }
    );
  }

  checkResults() {
    return this.http.get<{ success: boolean; finishedResults: any[] }>(
      `${BACKEND_URL}/${ApiRoutes.RESULTS}/check-in-progress`
    );
  }

  collectReward(resultId: string) {
    return this.http.get<{ success: boolean; finishedResults: any[] }>(
      `${BACKEND_URL}/${ApiRoutes.RESULTS}/${resultId}/collect-reward`
    );
  }

  postResult(adventureId: number, characterId: string) {
    const resultBody: Request_Result_POST_body = {
      adventureId,
      characterId,
    };

    return this.http.post<Response_Result_POST>(
      `${BACKEND_URL}/${ApiRoutes.RESULTS}`,
      resultBody
    );
  }
}
