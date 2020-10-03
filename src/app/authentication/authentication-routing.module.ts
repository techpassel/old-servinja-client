import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthenticationComponent } from './authentication.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { AuthGuard } from 'src/guard/auth.guard';
import { ResendVerificationComponent } from './resend-verification/resend-verification.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';

const routes: Routes = [
  {
    path: '', component: AuthenticationComponent, canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: SignupComponent,
      },
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'verify-email/:token',
        component: VerifyEmailComponent,
      },
      {
        path: 'forget-password',
        component: ForgetPasswordComponent,
      },
      {
        path: 'resend-verification-email',
        component: ResendVerificationComponent,
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }
