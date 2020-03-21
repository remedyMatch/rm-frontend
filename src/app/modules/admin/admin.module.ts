import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SharedModule} from '../../shared/shared.module';

import {AdminComponent} from './admin.component';
import {AdminRoutingModule} from './admin.routes';


@NgModule({
  declarations: [AdminComponent],
  imports: [
    CommonModule,
    SharedModule,
    AdminRoutingModule,
  ],
})
export class AdminModule {
}
