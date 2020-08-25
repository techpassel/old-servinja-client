import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { EncryptDecryptService } from 'src/services/common/encrypt-decrypt.service';
import { CommonService } from "src/services/common/common.service";
import { NotificationService } from 'src/utils/notification.util';
import { OnBoardingRoutes } from 'src/utils/common.util';

@Injectable({
  providedIn: 'root'
})
export class CommonGuard implements CanActivate {
  constructor(
    private router: Router, 
    private helper: JwtHelperService, 
    private encriptionService: EncryptDecryptService,
    private commonService: CommonService,
    private notify: NotificationService
    ) { };

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let token = null;
    let onboardingStage = null;
    let access = localStorage.getItem('access');
    if (access) {
      let data = this.encriptionService.decrypt(access);
      token = data?.token;
      onboardingStage = data?.onboardingStage;
      if (token && token != "") {
        const isExpired = this.helper.isTokenExpired(token);
        if (!isExpired) {
          if (onboardingStage != 0 && !state.url.includes("/onboard")) {
            //state.url gives current route url.
            let routeType = "/onboard/" + OnBoardingRoutes[parseInt(onboardingStage) - 1];
            this.router.navigate([routeType]);
            return false;
          }
          return true;
        }
      }
    }

    this.notify.showWarning("Your token is invalid or it has been expired. Please login again.");
    this.commonService.logout();
    return false;
  }
}
