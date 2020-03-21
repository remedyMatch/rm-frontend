import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {BestandMeldenComponent} from "./bestand-melden.component";


const routes: Routes = [
  {
    path: '',
    component: BestandMeldenComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BestandMeldenRoutingModule {
}
