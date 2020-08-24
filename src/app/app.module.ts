import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { AuthGuard } from 'src/guard/auth.guard';
import { AdminGuard } from 'src/guard/admin.guard';
import { HttpGlobalInterceptorService } from "src/services/common/http-global-interceptor.service";
import { EncryptDecryptService } from "src/services/common/encrypt-decrypt.service";
import { CommonGuard } from 'src/guard/common.guard';
import { OnboardGuard} from 'src/guard/onboard.guard';

export function tokenGetter() {
  let token = null;
  let str = localStorage.getItem('access');
  if (str) {
    let encryptionService = new EncryptDecryptService();
    token = encryptionService.decrypt(str)?.token;
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
        allowedDomains: [environment.baseApiUrl],
        disallowedRoutes: [environment.baseApiUrl + "/auth"],
      },
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
