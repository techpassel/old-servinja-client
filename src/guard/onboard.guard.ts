import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { EncryptDecryptService } from 'src/services/common/encrypt-decrypt.service';
import { OnBoardingRoutes } from '../utils/common.util';

@Injectable({
  providedIn: 'root'
})
export class OnboardGuard implements CanActivate {
  constructor(private router: Router, private helper: JwtHelperService, private encriptionService: EncryptDecryptService) { };

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let access = localStorage.getItem('access');
    let data = this.encriptionService.decrypt(access);
    let onboardingStage = data?.onboardingstage;
    let routeType = null;
    if (onboardingStage && parseInt(onboardingStage) > 0) {
      let desiredRoute = OnBoardingRoutes[parseInt(onboardingStage) - 1];
      console.log(ActivatedRouteSnapshot, "ActivatedRouteSnapshot");
    } else {
      let rolesInString = data?.roles;
      let rolesInArray = rolesInString?.split(",")?.map(e => e.trim());
      //Following line needs to be modified incase other usertypes are added in future.
      routeType = rolesInArray.includes('admin') ? '/admin' : rolesInArray.includes('customer') ? '/customer' : null;
    }

    return true;
  }

}
