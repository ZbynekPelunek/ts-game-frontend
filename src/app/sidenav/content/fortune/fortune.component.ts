import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

import { Attempt, Mount } from '../../../../../../shared/src';

const BACKEND_URL = `${environment.apiUrl}`;

@Component({
  templateUrl: './fortune.component.html'
})
export class FortuneComponent implements OnInit {
  howManyTries: number = 0;
  selectedMount: string = '';

  mounts: Mount[] = [
  ]

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<Mount[]>(`${BACKEND_URL}/fortune/mounts`).subscribe((mounts) => {
      this.mounts = mounts;
    });
  }

  onSelectChange() {
    this.howManyTries = 0;
  }

  onPredict() {
    if (this.selectedMount === '') {
      return;
    }
    const predictBody = {
      tries: 0
    }
    this.http.post<Attempt>(`${BACKEND_URL}/fortune/predict`, predictBody).subscribe((attempts) => {
      this.howManyTries = attempts.attempts;
    })
  }
}
