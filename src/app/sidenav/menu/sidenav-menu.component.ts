import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-sidenav-menu',
  templateUrl: './sidenav-menu.component.html',
  styleUrls: ['./sidenav-menu.component.css'],
  imports: [CommonModule, RouterLink]
})
export class SidenavMenuComponent {
  menuLinks = [
    {
      label: 'Character',
      link: '/ui/menu/character'
    },
    {
      label: 'Adventures',
      link: '/ui/menu/adventures'
    }
  ];
}
