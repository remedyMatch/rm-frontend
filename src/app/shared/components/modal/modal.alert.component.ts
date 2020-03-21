import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal-content',
  template: `
    <div class="modal-header">
      <h4 class="modal-title">{{title}}</h4>
    </div>
    <div class="modal-body">
      <p>{{message}}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-primary m-auto" (click)="activeModal.close('Close click')">Ok</button>
    </div>
  `
})
export class NgbdAlertContentComponent {
  @Input() title;
  @Input() message;

  constructor(public activeModal: NgbActiveModal) {
  }
}
