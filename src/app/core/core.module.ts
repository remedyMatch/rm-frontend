import {NgModule, Optional, SkipSelf} from '@angular/core';
import {CommonModule} from '@angular/common';
import {throwIfAlreadyLoaded} from './module-import-guard';

import {ModalService, RouteService} from './common';
import {ArticleService} from './domains';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [ModalService, RouteService, ArticleService]
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }
}
