import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { EncryptDecryptService } from 'src/services/common/encrypt-decrypt.service';
import { OnBoardingRoutes } from '../utils/common.util';
import { NotificationService } from 'src/utils/notification.util';

@Injectable({
  providedIn: 'root'
})
export class OnboardGuard implements CanActivate {
  constructor(
    private router: Router,
    private helper: JwtHelperService,
    private encriptionService: EncryptDecryptService,
    private notify: NotificationService
  ) { };

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let access = localStorage.getItem('access');
    let data = this.encriptionService.decrypt(access);
    let onboardingStage = data?.onboardingStage;
    let routeType = null;

    if (onboardingStage && parseInt(onboardingStage) > 0) {
      let currentRouteAsArray = state.url.split("/");
      let currentRouteIndex = 0;
      if (currentRouteAsArray.length == 3 && currentRouteAsArray[currentRouteAsArray.length - 1] != "onboard") {
        currentRouteIndex = OnBoardingRoutes.indexOf(currentRouteAsArray[currentRouteAsArray.length - 1]);
        if (currentRouteIndex == -1) {
          routeType = "/onboard";
        }
      }

      if (currentRouteIndex > (parseInt(onboardingStage) - 1)) {
        routeType = "/onboard/" + OnBoardingRoutes[parseInt(onboardingStage) - 1];
      }
    } else {
      let rolesInString = data?.roles;
      let rolesInArray = rolesInString?.split(",")?.map(e => e.trim());
      //Following line needs to be modified incase other usertypes are added in future.
      routeType = rolesInArray.includes('admin') ? '/admin' : rolesInArray.includes('customer') ? '/customer' : null;
    }

    if (routeType && !state.url != routeType) {
      this.router.navigate([routeType]);
      return false;
    }

    return true;
  }

}
