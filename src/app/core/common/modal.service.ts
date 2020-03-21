import {Injectable} from '@angular/core';

import {NgbModal, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import {
  NgbdModalContentComponent,
  NgbdAlertContentComponent,
} from '../../shared/components/modal';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private modalService: NgbModal) {
  }

  confirm(title: string, message: string) {
    const options: NgbModalOptions = {
      windowClass: 'modal-dialog',
      backdrop: 'static'
    };
    const modalRef = this.modalService.open(NgbdModalContentComponent, options);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    return modalRef;
  }

  alert(title: string, message: string) {
    const options: NgbModalOptions = {
      windowClass: 'modal-dialog',
      backdrop: 'static'
    };
    const modalRef = this.modalService.open(NgbdAlertContentComponent, options);
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    return modalRef;
  }
}
