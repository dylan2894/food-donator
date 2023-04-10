import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  @Input() donorId = '';
  @Input() date = '';
  @Input() startTime = '';
  @Input() endTime = '';
  @Input() description = '';
  @Input() tags: string[] = [];
  @Input() isCurrent = false;
  @Input() forCarousel = false;

  correspondingDonor: User|null = null;

  constructor(private userService: UserService) {
    $(() => {
      // initialize chips UI component
      $('.chips').chips();
    });
  }

  ngOnInit() {
    // if donorId is supplied, fetch the donor which corresponds to this donation card.
    if(this.donorId != '') {
      this.userService.getUser(this.donorId).then((user) => {
        if(user != null){ this.correspondingDonor = user ; }
      });
    }
  }
}
