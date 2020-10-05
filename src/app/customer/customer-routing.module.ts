import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerComponent } from './customer.component';
import { HomeComponent } from './home/home.component';

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
        component: HomeComponent,
      },
      {
        path: 'services',
        component: HomeComponent,
      },
      {
        path: 'subscriptions',
        component: HomeComponent,
      }
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
