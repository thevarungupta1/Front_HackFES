import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParticipationComponent } from './participation.component';
import { GenericComponent } from './generic.component';
import { EngagementComponent } from './engagement.component';
import {RetentionComponent} from './retention.component';
import {AcquisitionComponent} from './acquisition.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Reports'
    },
    children: [
      {
        path: '',
        redirectTo: 'participation'
      },
      {
        path: 'participation',
        component: ParticipationComponent,
        data: {
          title: 'Participation Metrics'
        }
      },
      {
        path: 'generic',
        component: GenericComponent,
        data: {
          title: 'Generic Metrics'
        }
      },
      {
        path: 'engagement',
        component: EngagementComponent,
        data: {
          title: 'Engagement Metrics'
        }
      },
      {
        path: 'retention',
        component: RetentionComponent,
        data: {
          title: 'Retention Metrics'
        }
      },
      {
        path: 'acquisition',
        component: AcquisitionComponent,
        data: {
          title: 'Acquisition Metrics'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {}
