import { Component, OnInit } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Observable } from 'rxjs/internal/Observable';

import { AuthService } from '../auth/auth.service';
import { RouterOutlet } from '@angular/router';
import { SidenavMenuComponent } from './menu/sidenav-menu.component';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css'],
  imports: [MatSidenavModule, RouterOutlet, SidenavMenuComponent, CommonModule]
})
export class SidenavComponent implements OnInit {
  hasCharacters$: Observable<boolean>;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.hasCharacters$ = this.authService.hasCharacters$;
  }
}
