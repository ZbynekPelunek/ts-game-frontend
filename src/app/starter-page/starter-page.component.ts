import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-starter-page',
  templateUrl: './starter-page.component.html',
  styleUrls: ['./starter-page.component.css']
})
export class StarterPageComponent {
  constructor(private router: Router) {}

  startAdventure(): void {
    this.router.navigate(['/ui/auth/signup']);
  }
}
