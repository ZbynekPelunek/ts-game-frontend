import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';

import { Attribute } from '../../../../../../shared/src';

const BACKEND_URL = `${environment.apiUrl}`;

@Injectable({ providedIn: 'root' })
export class CharacterService {

  constructor(private http: HttpClient) { }

  getAttributes(): Observable<{ success: boolean, attributes: Attribute[] }> {
    return this.http.get<{ success: boolean, attributes: Attribute[] }>(`${BACKEND_URL}/attributes`);
  }

  getSingleAttribute(attributeId: string): Observable<{ success: boolean, attribute: Attribute }> {
    return this.http.get<{ success: boolean, attribute: Attribute }>(`${BACKEND_URL}/attributes/${attributeId}`);
  }

}
