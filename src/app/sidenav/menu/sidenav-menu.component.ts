import { Component } from '@angular/core';

@Component({
  selector: 'app-sidenav-menu',
  templateUrl: './sidenav-menu.component.html',
  styleUrls: ['./sidenav-menu.component.css']
})
export class SidenavMenuComponent {
  menuLinks = [
    // {
    //   label: 'Dashboard',
    //   link: '/menu/dashboard'
    // },
    {
      label: 'Character',
      link: '/menu/character'
    },
    // {
    //   label: 'Fortune Teller',
    //   link: '/menu/fortune'
    // },
    // {
    //   label: 'Arena',
    //   link: '/menu/arena'
    // },
    {
      label: 'Adventures',
      link: '/menu/adventures'
    },
    {
      label: 'Shop',
      link: '/menu/shop'
    }
  ]
}
