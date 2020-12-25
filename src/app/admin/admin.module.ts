import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { CommonViewsModule } from '../common-views/common-views.module';
import { AdminCategoriesComponent } from '../admin/admin-categories/admin-categories.component';
import { AdminServicesComponent } from './admin-services/admin-services.component';
import { AdminAddServicesComponent } from './admin-add-services/admin-add-services.component';
import { AdminAddCategoriesComponent } from './admin-add-categories/admin-add-categories.component';

@NgModule({
  declarations: [AdminComponent, AdminDashboardComponent, AdminCategoriesComponent, AdminServicesComponent, AdminAddServicesComponent, AdminAddCategoriesComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    CommonViewsModule
  ]
})
export class AdminModule { }
