import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

const BACKEND_URL = `${environment.apiUrl}`;

@Component({
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  isLoading = false;

  constructor(private http: HttpClient) { }

  onSignUp(event: Event): void {
    console.log('event: ', event)
    this.http.post(`${BACKEND_URL}/accounts`, { username: 'test', email: 'test1@test.test', password: '123' }).subscribe({
      next: (response) => {
        console.log('signed up: ', response);
      }
    })
  }
}
