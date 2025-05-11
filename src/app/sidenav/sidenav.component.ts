import { Component } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';

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
export class SidenavComponent {}
