import { NgModule } from '@angular/core';
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  imports: [
    SettingsRoutingModule,
    ChartsModule
  ],
  declarations: [ SettingsComponent ]
})
export class SettingsModule { }
