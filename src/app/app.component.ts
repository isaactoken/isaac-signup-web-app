import { Component } from '@angular/core';

import { CookieService } from 'ngx-cookie-service';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';

import { Globals } from './app.globals';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  constructor(private cookieService: CookieService, private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics, private globals: Globals) {}

  onActivate(event) {
    window.scroll(0,0);
  }
}
