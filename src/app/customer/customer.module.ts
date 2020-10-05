import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { SideNavTogglerComponent } from '../common-views/side-nav-toggler/side-nav-toggler.component';
import { SideNavComponent } from '../common-views/side-nav/side-nav.component';
import { HomeComponent } from './home/home.component';
import { PopupModule } from '@progress/kendo-angular-popup';

@NgModule({
  declarations: [CustomerComponent, SideNavTogglerComponent, SideNavComponent, HomeComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    PopupModule
  ]
})
export class CustomerModule { }
