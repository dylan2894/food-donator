import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chip-selector',
  templateUrl: './chip-selector.component.html',
  styleUrls: ['./chip-selector.component.css']
})
export class ChipSelectorComponent {
  chips: string[] = ["Canned Food", "Grains", "Blankets", "Clothes"];
  selected: string[] = [];

  toggleChipSelect(chip: string) {
    if(this.selected.includes(chip)) {
      this.selected = this.removeSelection(chip);
      $('.chip:contains("'+chip+'")').removeClass("selected");
      $('.chip:contains("'+chip+'")').html(chip);
      return;
    }

    this.selected.push(chip);
    $('.chip:contains("'+chip+'")').addClass("selected");
    $('.chip:contains("'+chip+'")').html(chip + "<i class='close material-icons'>close</i>");
  }

  private removeSelection(chip: string) {
    return this.selected.filter(selection => selection != chip);
  }
}
