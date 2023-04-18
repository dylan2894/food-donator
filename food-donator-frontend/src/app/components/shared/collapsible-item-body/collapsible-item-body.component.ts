import { Component, Input } from '@angular/core';
import { Donation } from 'src/app/models/donation.model';
import { Tag } from 'src/app/models/tag.model';
import { DonationService } from 'src/app/services/donation/donation.service';
import { UserTagService } from 'src/app/services/user-tag/user-tag.service';
import DateUtil from 'src/app/utils/DateUtil';

@Component({
  selector: 'app-collapsible-item-body',
  templateUrl: './collapsible-item-body.component.html',
  styleUrls: ['./collapsible-item-body.component.css']
})
export class CollapsibleItemBodyComponent {

  @Input() donation: Donation | null = null;

  tags: Tag[] | null = null;

  constructor(
    public dateUtil: DateUtil,
    private userTagService: UserTagService
  ) {
    $(() => {
      if(this.donation?.id != null) {
        this.userTagService.getTagsByDonationId(this.donation.id).then((tags) => {
          this.tags = tags;
        });
      }
    });
  }
}
