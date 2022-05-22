import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';
import { EncryptDecryptService } from 'src/services/common/encrypt-decrypt.service';
import { StoreService } from 'src/services/common/store.service';
import { NotificationUtil } from 'src/utils/notification.util';
import { OnBoardingRoutes } from 'src/utils/common.util';

@Injectable({
  providedIn: 'root'
})
export class CommonGuard implements CanActivate {
  constructor(
    private router: Router,
    private helper: JwtHelperService,
    private encriptionService: EncryptDecryptService,
    private storeService: StoreService,
    private notify: NotificationUtil
    ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let token = null;
    let onboardingStage = null;
    const access = localStorage.getItem('access');
    if (access) {
      const data = this.encriptionService.decrypt(access);
      token = data?.token;
      onboardingStage = data?.onboardingStage;
      if (token && token !== '') {
        const isExpired = this.helper.isTokenExpired(token);
        if (!isExpired) {
          if (onboardingStage !== 0 && !state.url.includes('/onboard')) {
            // state.url gives current route url.
            const routeType = '/onboard/' + OnBoardingRoutes[parseInt(onboardingStage, 10) - 1];
            this.router.navigate([routeType]);
            return false;
          }
          return true;
        }
      }
    }

    this.notify.showWarning('Your token is invalid or it has been expired. Please login again.');
    this.storeService.logout();
    return false;
  }
}
