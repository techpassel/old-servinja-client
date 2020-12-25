import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { HomeComponent } from './home/home.component';
import { CommonViewsModule } from '../common-views/common-views.module';
import { ServicesComponent } from './services/services.component';
import { AccountComponent } from './account/account.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { CartComponent } from './cart/cart.component';

@NgModule({
  declarations: [CustomerComponent, HomeComponent, ServicesComponent, AccountComponent, SubscriptionsComponent, CartComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    CommonViewsModule
  ]
})
export class CustomerModule { }
