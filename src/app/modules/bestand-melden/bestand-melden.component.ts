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
  categories = ['Medizin'];
  constructor(private formBuilder: FormBuilder, private calendar: NgbCalendar) {
    this.meldenForm = this.formBuilder.group({
      description: '',
      manufacturer: '',
      quantity: 0,
      originalPackaging: false,
      medicalProduct: false,
      bestBefore: [this.calendar.getToday(), null],
      dateOfPurchase: [this.calendar.getToday(), null],
      itemLocation: '',
      storageConditions: ''
    });
  }
  bestBeforeDateChanged() {
    const dateField = this.meldenForm.get('bestBefore');
    console.log('Date field value: ', dateField.value);
  }
  dateOfPurchaseDateChanged() {
    const dateField = this.meldenForm.get('bestBefore');
    console.log('Date field value: ', dateField.value);
  }
  ngOnInit(): void {
  }

  onSubmit(customerData) {
    console.log(customerData);
  }

}
