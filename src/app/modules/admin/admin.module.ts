import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';

import {SharedModule} from '../../shared/shared.module';
import {AdminComponent} from './admin.component';
import {AdminRoutingModule} from './admin.routes';


@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
    FormsModule,
    NgbDatepickerModule
  ],
})
export class AdminModule {
}
