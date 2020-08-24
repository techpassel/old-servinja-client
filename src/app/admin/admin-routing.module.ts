import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminGuard } from 'src/guard/admin.guard';

const routes: Routes = [
  {
    path: '', component: AdminComponent, canActivate: [AdminGuard],
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
      }
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
