import { Component, EventEmitter, Output } from '@angular/core';
import { Tag } from 'src/app/models/tag.model';
import { TagService } from 'src/app/services/tag/tag.service';

@Component({
  selector: 'app-chip-selector',
  templateUrl: './chip-selector.component.html',
  styleUrls: ['./chip-selector.component.css']
})
export class ChipSelectorComponent {
  //chips: string[] = ["Canned Food", "Grains", "Long Life Milk", "Blankets", "Clothes","Clothes","Clothes","Clothes","Clothes","Clothes"];
  chips: Tag[] = [];
  selectedArray: Tag[] = [];
  @Output() selectedEvent = new EventEmitter<Tag[]>();

  constructor(private tagService: TagService) {
    this.tagService.getTags().then((tags) => {
      if(tags != null) {
        this.chips = tags;
      }
    });
  }

  toggleChipSelect(chip: Tag) {
    if(this.selectedArray.includes(chip)) {
      this.selectedArray = this.removeSelection(chip);
      $('.chip:contains("'+chip.name+'")').removeClass("selected");
      $('.chip:contains("'+chip.name+'")').html(chip.name);

      this.selectedEvent.emit(this.selectedArray);
      return;
    }

    this.selectedArray.push(chip);
    $('.chip:contains("'+chip.name+'")').addClass("selected");
    $('.chip:contains("'+chip.name+'")').html(chip.name + "<i class='close material-icons'>close</i>");
    this.selectedEvent.emit(this.selectedArray);
  }

  private removeSelection(chip: Tag) {
    return this.selectedArray.filter(selection => selection.name != chip.name);
  }
}
