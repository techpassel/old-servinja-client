import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingComponent } from './onboarding.component';
import { ProfileCompletionComponent } from './profile-completion/profile-completion.component';
import { MobileVerificationComponent } from './mobile-verification/mobile-verification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';
import { AddressComponent } from './address/address.component';
import { DocumentComponent } from './document/document.component';
import { UploadProgressComponent } from '../common-views/upload-progress/upload-progress.component';
import { DragAndDropDirective } from '../../directives/drag-and-drop.directive';

@NgModule({
  declarations: [
    OnboardingComponent,
    ProfileCompletionComponent,
    MobileVerificationComponent,
    AddressComponent,
    DocumentComponent,
    UploadProgressComponent,
    DragAndDropDirective
  ],
  imports: [
    CommonModule,
    OnboardingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgOtpInputModule,
  ]
})
export class OnboardingModule { }
