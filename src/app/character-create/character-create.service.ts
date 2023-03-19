import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CharacterCreateService {
  private charCreatingListener = new Subject<boolean>();

  charCreating$ = this.charCreatingListener.asObservable();

  constructor(private router: Router) { }

  setCharCreatingValue(value: boolean) {
    this.charCreatingListener.next(value);
  }

  create(): void {
    this.charCreatingListener.next(false);
    this.router.navigate(['/ui/menu/character']);
  }
}
