import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { AuthGuard } from 'src/guard/auth.guard';
import { AdminGuard } from 'src/guard/admin.guard';
import { HttpGlobalInterceptorService } from "src/utils/http-global-interceptor.util";
import { EncryptDecryptService } from "src/services/common/encrypt-decrypt.service";
import { CommonGuard } from 'src/guard/common.guard';
import { OnboardGuard} from 'src/guard/onboard.guard';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
export function tokenGetter() {
  let token = null;
  let str = localStorage.getItem('access');
  if (str) {
    let encryptionService = new EncryptDecryptService();
    token = encryptionService.decrypt(str).token;    
  }
  return token;
}

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
        tokenGetter: tokenGetter,
        allowedDomains: [environment.baseApiUrl.split("://")[environment.baseApiUrl.split("://").length -1]],
        disallowedRoutes: [environment.baseApiUrl + "/auth"],
      },
    }),
    BrowserAnimationsModule, 
    ToastrModule.forRoot({
      timeOut: 6000,  //default is 5000
      closeButton: true,
      extendedTimeOut: 1000,
      enableHtml: true,	
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      iconClasses:  {
        error: 'toast-error',
        info: 'toast-info',
        success: 'toast-success',
        warning: 'toast-warning',
      }
    }), 
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
