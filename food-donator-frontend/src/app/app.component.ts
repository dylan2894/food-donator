import { Component } from '@angular/core';
import { UserService } from './services/user/user.service';

declare const $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Food Donator';
}

