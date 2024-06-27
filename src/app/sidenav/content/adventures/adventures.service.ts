import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiRoutes, Response_Adventure_GET_all } from '../../../../../../shared/src';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class AdventuresService {

  constructor(private http: HttpClient) {}

  listAdventures() {
    return this.http.get<Response_Adventure_GET_all>(`${BACKEND_URL}/${ApiRoutes.ADVENTURES}`);
  }
}