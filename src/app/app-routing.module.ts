import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import { DefaultLayoutComponent } from './containers';

import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { LoginComponent } from './views/auth/login.component';
import { AuthGuard } from './views/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
    canActivate:[AuthGuard]
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    canActivate:[AuthGuard],
    children: [
      {
        path: 'reports',
        loadChildren: './views/reports/reports.module#ReportsModule',
        canActivate:[AuthGuard]
      },
      {
        path: 'users',
        loadChildren: './views/users/users.module#UsersModule',
        canActivate:[AuthGuard]
      },
      {
        path: 'settings',
        loadChildren: './views/settings/settings.module#SettingsModule',
        canActivate:[AuthGuard]
      },
      {
        path: 'dashboard',
        loadChildren: './views/dashboard/dashboard.module#DashboardModule',
        canActivate:[AuthGuard]
      },
      {
        path: 'fileupload',
        loadChildren: './views/fileupload/fileupload.module#FileUploadModule',
        canActivate:[AuthGuard]
      }
    ]
  },
  // {
  //   path: '**',
  //   loadChildren: './views/error/errors.module#ErrorsModule'
  // }
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
