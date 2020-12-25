import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerComponent } from './customer.component';
import { HomeComponent } from './home/home.component';
import { ServicesComponent } from './services/services.component';
import { AccountComponent } from './account/account.component';
import { SubscriptionsComponent } from './subscriptions/subscriptions.component';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [
  {
    path: '', component: CustomerComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'account',
        component: AccountComponent,
      },
      {
        path: 'services',
        component: ServicesComponent,
      },
      {
        path: 'subscriptions',
        component: SubscriptionsComponent,
      },
      {
        path: 'cart',
        component: CartComponent
      }
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
