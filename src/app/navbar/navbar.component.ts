import { Component } from '@angular/core';

import { Globals } from '../app.globals';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.less']
})
export class NavbarComponent {

  navbarCollapsed = true;
  isCollapsed = false;

  constructor(private globals: Globals) { }
}
