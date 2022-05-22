import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { EncryptDecryptService } from 'src/services/common/encrypt-decrypt.service';
import { OnBoardingRoutes } from '../utils/common.util';
import { NotificationUtil } from 'src/utils/notification.util';
import { StoreService } from 'src/services/common/store.service';

@Injectable({
  providedIn: 'root'
})
export class OnboardGuard implements CanActivate {
  constructor(
    private router: Router,
    private notify: NotificationUtil,
    private storeService: StoreService
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const onboardingStage = this.storeService.getOnboardingStage();
    let routeType = null;

    if (onboardingStage && parseInt(onboardingStage, 10) > 0) {
      const currentRouteAsArray = state.url.split('/');
      let currentRouteIndex = 0;
      if (currentRouteAsArray.length === 3 && currentRouteAsArray[currentRouteAsArray.length - 1] !== 'onboard') {
        currentRouteIndex = OnBoardingRoutes.indexOf(currentRouteAsArray[currentRouteAsArray.length - 1]);
      }
      // To redirect to previous step if previous step is not completed yet.
      if ((currentRouteIndex + 1) > onboardingStage) {
        routeType = '/onboard/' + OnBoardingRoutes[parseInt(onboardingStage, 10) - 1];
      }
    } else {
      const rolesInString = this.storeService.getUserRoles();
      const rolesInArray = rolesInString?.split(',')?.map(e => e.trim());
      // Following line needs to be modified incase other usertypes are added in future.
      routeType = rolesInArray.includes('admin') ? '/admin' : rolesInArray.includes('customer') ? '/customer' : null;
    }

    if (routeType && !state.url !== routeType) {
      this.router.navigate([routeType]);
      return false;
    }

    return true;
  }

}
