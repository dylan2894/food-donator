import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Tag } from 'src/app/models/tag.model';
import { TagService } from 'src/app/services/tag/tag.service';

@Component({
  selector: 'app-chip-selector',
  templateUrl: './chip-selector.component.html',
  styleUrls: ['./chip-selector.component.css']
})
export class ChipSelectorComponent {
  @Input() chips: Tag[] = [];
  @Input() toggleEnabled = false;
  selectedArray: Tag[] = [];
  @Output() selectedEvent = new EventEmitter<Tag[]>();

  toggleChipSelect(chip: Tag) {
    if(this.toggleEnabled) {
      // if chip is already selected, unselect it
      if(this.selectedArray.includes(chip)) {
        this.selectedArray = this.removeSelection(chip);

        $('.chipSelectorChip:contains("'+chip.name+'")').removeClass("selected");
        $('.chipSelectorChip:contains("'+chip.name+'")').html(chip.name); // remove the close icon

        this.selectedEvent.emit(this.selectedArray);
        return;
      }

      // if chip is not selected, select it
      this.selectedArray.push(chip);
      $('.chipSelectorChip:contains("'+chip.name+'")').addClass("selected");
      $('.chipSelectorChip:contains("'+chip.name+'")').html(chip.name + "<i class='close material-icons'>close</i>");
      this.selectedEvent.emit(this.selectedArray);
    }
  }

  private removeSelection(chip: Tag) {
    return this.selectedArray.filter(selection => selection.name != chip.name);
  }
}
