import { Component } from '@angular/core';

@Component({
  selector: 'app-sidenav-menu',
  templateUrl: './sidenav-menu.component.html',
  styleUrls: ['./sidenav-menu.component.css']
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
    },
    // {
    //   label: 'Shop',
    //   link: '/ui/menu/shop'
    // }
  ]
}
