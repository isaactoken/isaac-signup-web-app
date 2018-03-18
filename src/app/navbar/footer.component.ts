import { Component } from '@angular/core';

import { Globals } from '../app.globals';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent {

  constructor(private globals: Globals) { }
}
