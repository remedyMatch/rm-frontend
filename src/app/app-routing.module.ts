import {NgModule} from '@angular/core';
import {Routes, RouterModule, ExtraOptions} from '@angular/router';


const routes: Routes = [{
  path: '',
  children: [
    {path: '', loadChildren: () => import('./modules/admin/admin.module').then(m => m.AdminModule)},
    {path: 'bestand-melden/', loadChildren: () => import('./modules/bestand-melden/bestand-melden.module').then(m => m.BestandMeldenModule)},
  ],

}
];

const config: ExtraOptions = {
  useHash: true
};

@NgModule({
  imports: [RouterModule.forRoot(routes, config)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
