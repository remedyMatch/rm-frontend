import { Component, OnInit } from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from '@angular/forms';
import {NgbDateStruct, NgbCalendar} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-bestand-melden',
  templateUrl: './bestand-melden.component.html',
  styleUrls: ['./bestand-melden.component.scss']
})
export class BestandMeldenComponent implements OnInit {
  meldenForm;
  bestBeforeModel: NgbDateStruct;
  date: { year: number, month: number };

  constructor(private formBuilder: FormBuilder, private calendar: NgbCalendar) {
    this.meldenForm = this.formBuilder.group({
      description: '',
      manufacturer: '',
      quantity: 0,
      originalPackaging: false,
      medicalProduct: false,
      bestBefore: [this.calendar.getToday(), null],
      dateOfPurchase: this.calendar.getToday(),
      itemLocation: '',
      storageConditions: ''
    });
  }
  bestBeforeDateChanged() {
    const dateField = this.meldenForm.get('bestBefore');
    console.log('Date field value: ', dateField.value);
  }
  ngOnInit(): void {
  }

  onSubmit(customerData) {
  }

}
