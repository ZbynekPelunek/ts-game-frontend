import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  hasCharacters$!: Observable<boolean>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.hasCharacters$ = this.authService.hasCharacters$;
  }
}
