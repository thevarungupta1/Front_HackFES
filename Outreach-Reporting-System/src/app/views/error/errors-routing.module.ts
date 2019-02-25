import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ErrorsComponent } from './errors.component';
import { P404Component } from './404.component';

const routes: Routes = [
    { path: '', component: P404Component },
  { path: 'error', component: ErrorsComponent },
  { path: '**', component: P404Component, data: { error: 404 } },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule { }
