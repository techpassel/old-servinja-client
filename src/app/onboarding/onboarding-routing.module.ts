import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnboardingComponent } from './onboarding.component';
import { OnboardGuard } from 'src/guard/onboard.guard';
import { ProfileCompletionComponent } from './profile-completion/profile-completion.component';
import { MobileVerificationComponent } from './mobile-verification/mobile-verification.component';
import { AddressComponent } from './address/address.component';
import { DocumentComponent } from './document/document.component';

const routes: Routes = [
  {
    path: '', component: OnboardingComponent, canActivate: [OnboardGuard],
    children: [
      {
        path: '',
        component: ProfileCompletionComponent,
      },
      {
        path: 'verify-number',
        component: MobileVerificationComponent,
      },
      {
        path: 'address',
        component: AddressComponent,
      },
      {
        path: 'document',
        component: DocumentComponent,
      }
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }
