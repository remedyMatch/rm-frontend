import { Component, OnInit } from '@angular/core';
import {FormBuilder, ReactiveFormsModule} from "@angular/forms";
import {NgbCalendar} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-bestand-melden',
  templateUrl: './bestand-melden.component.html',
  styleUrls: ['./bestand-melden.component.less']
})
export class BestandMeldenComponent implements OnInit {
  meldenForm;


  constructor(private formBuilder: FormBuilder, private calendar: NgbCalendar) {
    this.meldenForm = this.formBuilder.group({
      menge: 0,
      originalverpackt: false,
      kaufdatum: this.calendar.getToday(),
    });
  }

  ngOnInit(): void {
  }

  onSubmit(customerData) {
  }

}
