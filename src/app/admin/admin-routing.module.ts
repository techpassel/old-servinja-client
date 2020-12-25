import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminGuard } from 'src/guard/admin.guard';
import { AdminCategoriesComponent } from '../admin/admin-categories/admin-categories.component';
import { AdminServicesComponent } from './admin-services/admin-services.component';

const routes: Routes = [
  {
    path: '', component: AdminComponent, canActivate: [AdminGuard],
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
      },
      {
        path: 'categories',
        component: AdminCategoriesComponent,
      },
      {
        path: 'services',
        component: AdminServicesComponent,
      }
    ],
  },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
