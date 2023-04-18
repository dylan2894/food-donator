import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Food Donator';

  constructor() {
    console.log("Env.link: " + environment.link);
  }
}

