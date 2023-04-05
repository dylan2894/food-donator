import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {
  @Input() date = '';
  @Input() startTime = '';
  @Input() endTime = '';
  @Input() description = '';
  @Input() tags: string[] = [];
  @Input() isCurrent = false;

  constructor() {
    $(document).ready(() => {
      $('.chips').chips();
    });
  }
}
