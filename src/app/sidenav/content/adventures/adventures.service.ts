import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiRoutes, Request_Adventure_GET_all_query, Response_Adventure_GET_all } from '../../../../../../shared/src';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class AdventuresService {

  constructor(private http: HttpClient) {}

  listAdventures(populateReward?: boolean) {
    const queryString: Request_Adventure_GET_all_query = {};

    if (populateReward) queryString.populateReward = populateReward;

    return this.http.get<Response_Adventure_GET_all>(`${BACKEND_URL}/${ApiRoutes.ADVENTURES}`, {params: queryString as HttpParams});
  }
}