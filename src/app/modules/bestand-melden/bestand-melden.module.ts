import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BestandMeldenComponent } from './bestand-melden.component';
import {BestandMeldenRoutingModule} from "./bestand-melden.routes";
import {SharedModule} from "../../shared/shared.module";
import {ReactiveFormsModule} from "@angular/forms";



@NgModule({
  declarations: [BestandMeldenComponent],
  imports: [
    CommonModule,
    SharedModule,
    BestandMeldenRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
  ]
})
export class BestandMeldenModule {
}
