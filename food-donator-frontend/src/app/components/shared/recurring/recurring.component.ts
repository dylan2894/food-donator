import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-recurring',
  templateUrl: './recurring.component.html',
  styleUrls: ['./recurring.component.css']
})
export class RecurringComponent {
  @Output() selectedEvent = new EventEmitter<string>();
  @Output() enteredQuantity = new EventEmitter<number>();

  selections = ["never", "daily", "weekly", "monthly"]
  selected = "never";
  quantity = 1;

  recurringForm = this.fb.group({
    recurringCtrl: [''],
    recurringQuantity: ['']
  });

  constructor(private fb: FormBuilder) {}

  setRecurringUnit(newSelection: string) {
    if(!this.selections.includes(newSelection)) {
      this.recurringForm.controls.recurringCtrl.setErrors({
        incorrectUnit: true
      });
      return;
    }

    this.recurringForm.controls.recurringCtrl.setErrors(null);

    this.selected = newSelection;
    this.selectedEvent.emit(this.selected);
  }

  setQuantity(quantity: string) {
    if(this.quantity < 1 || this.quantity > 30) {
      this.recurringForm.controls.recurringQuantity.setErrors({
        incorrectQuantity: true
      });
      return;
    }

    this.recurringForm.controls.recurringQuantity.setErrors(null);

    this.quantity = Number(quantity);
    this.enteredQuantity.emit(this.quantity);
  }
}
