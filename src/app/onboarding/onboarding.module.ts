import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingComponent } from './onboarding.component';
import { ProfileCompletionComponent } from './profile-completion/profile-completion.component';


@NgModule({
  declarations: [OnboardingComponent, ProfileCompletionComponent],
  imports: [
    CommonModule,
    OnboardingRoutingModule
  ]
})
export class OnboardingModule { }
