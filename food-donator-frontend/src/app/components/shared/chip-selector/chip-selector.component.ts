import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-chip-selector',
  templateUrl: './chip-selector.component.html',
  styleUrls: ['./chip-selector.component.css']
})
export class ChipSelectorComponent {
  chips: string[] = ["Canned Food", "Grains", "Long Life Milk", "Blankets", "Clothes","Clothes","Clothes","Clothes","Clothes","Clothes"];
  selectedArray: string[] = [];
  @Output() selectedEvent = new EventEmitter<string[]>();

  toggleChipSelect(chip: string) {
    if(this.selectedArray.includes(chip)) {
      this.selectedArray = this.removeSelection(chip);
      $('.chip:contains("'+chip+'")').removeClass("selected");
      $('.chip:contains("'+chip+'")').html(chip);

      this.selectedEvent.emit(this.selectedArray);
      return;
    }

    this.selectedArray.push(chip);
    $('.chip:contains("'+chip+'")').addClass("selected");
    $('.chip:contains("'+chip+'")').html(chip + "<i class='close material-icons'>close</i>");
    this.selectedEvent.emit(this.selectedArray);
  }

  private removeSelection(chip: string) {
    return this.selectedArray.filter(selection => selection != chip);
  }
}
