import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnboardingComponent } from './onboarding.component';
import { OnboardGuard } from 'src/guard/onboard.guard';
import { ProfileCompletionComponent } from './profile-completion/profile-completion.component';

const routes: Routes = [
  {
    path: '', component: OnboardingComponent, canActivate: [OnboardGuard],
    children: [
      {
        path: '',
        component: ProfileCompletionComponent,
      },
      {
        path: 'mobile-verification',
        component: ProfileCompletionComponent,
      }
    ],
  },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OnboardingRoutingModule { }
