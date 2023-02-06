import { Component } from '@angular/core';

declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Food Donator';
  isDonor = true;

  constructor() {
    //TODO check if user is a donor or donee

  }

}
