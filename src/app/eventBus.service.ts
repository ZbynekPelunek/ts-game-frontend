import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export enum CharacterEvents {
  REFRESH_EQUIPMENT = 'refresh-equipment',
  REFRESH_INVENTORY = 'refresh-inventory',
  REFRESH_ATTRIBUTES = 'refresh-attributes',
  REFRESH_CURRENCIES = 'refresh-currencies',
}

export enum AdventureEvents {
  REFRESH_ADVENTURES = 'refresh-adventures',
  REFRESH_RESULTS = 'refresh-results',
  REFRESH_INPROGRESS = 'refresh-inprogress',
  REFRESH_UNCOLLECTED_REWARDS = 'refresh-uncollected-rewards',
}

@Injectable({
  providedIn: 'root',
})
export class EventBusService {
  private eventSubject = new Subject<string>();

  emitEvent(event: string): void {
    this.eventSubject.next(event);
  }

  getEvents(): Observable<string> {
    return this.eventSubject.asObservable();
  }
}
