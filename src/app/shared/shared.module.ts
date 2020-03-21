import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {sharedComponents} from './components';

@NgModule({
  declarations: [...sharedComponents],
  imports: [
    CommonModule,
    // FormsModule
  ],
  exports: [FormsModule, NgbModule, ...sharedComponents]
})
export class SharedModule {
}
