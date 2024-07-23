import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
  ApiRoutes,
  Request_Adventure_GET_all_query,
  Request_Result_POST_body,
  Response_Adventure_GET_all,
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

  postResult(adventureId: number, characterId: string): void {
    const resultBody: Request_Result_POST_body = {
      adventureId,
      characterId,
    };

    this.http
      .post<Response_Result_POST>(
        `${BACKEND_URL}/${ApiRoutes.RESULTS}`,
        resultBody
      )
      .subscribe({
        next: (response) => {
          console.log('POST Result reponse: ', response);
        },
      });
  }
}
