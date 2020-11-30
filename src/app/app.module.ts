import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { AuthGuard } from 'src/guard/auth.guard';
import { AdminGuard } from 'src/guard/admin.guard';
import { HttpGlobalInterceptorService } from 'src/utils/http-global-interceptor.util';
import { EncryptDecryptService } from 'src/services/common/encrypt-decrypt.service';
import { CommonGuard } from 'src/guard/common.guard';
import { OnboardGuard } from 'src/guard/onboard.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgOtpInputModule } from 'ng-otp-input';
import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER
} from 'ngx-ui-loader';

export function tokenGetter(): string {
  let token = null;
  const str = localStorage.getItem('access');
  if (str) {
    const encryptionService = new EncryptDecryptService();
    token = encryptionService.decrypt(str).token;
  }
  return token;
}

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  hasProgressBar: false,
  fgsColor: '#1500b3',
  fgsType: SPINNER.threeStrings,
  fgsSize: 80,
  gap: 30,
  overlayColor: 'rgba(27, 103, 224, 0.4)'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: [environment.baseApiUrl.split('://')[environment.baseApiUrl.split('://').length - 1]],
        disallowedRoutes: [environment.baseApiUrl + '/auth'],
      },
    }),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 6000,  // default is 5000
      closeButton: true,
      extendedTimeOut: 1000,
      enableHtml: true,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      iconClasses: {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning',
      }
    }),
    NgOtpInputModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
  ],
  providers: [AuthGuard,
    AdminGuard,
    CommonGuard,
    OnboardGuard,
    { provide: HTTP_INTERCEPTORS, useClass: HttpGlobalInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
