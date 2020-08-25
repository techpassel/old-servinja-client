import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { EncryptDecryptService } from 'src/services/common/encrypt-decrypt.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private helper: JwtHelperService, private encriptionService: EncryptDecryptService) { };

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let access = localStorage.getItem('access');
    let token = null;
    let onboardingStage = null;
    let routeType = null;

    if (access) {
      let data = this.encriptionService.decrypt(access);
      token = data?.token;
      onboardingStage = data?.onboardingStage;
      const isExpired = token ? this.helper.isTokenExpired(token) : true;
      if (token && !isExpired) {
        if (onboardingStage == 0) {
          //Following line needs to be modified incase other usertypes are added in future.
          routeType = data?.roles.includes('admin') ? '/admin' : data?.roles.includes('customer') ? '/customer' : null;
        } else {
          routeType = '/onboard';
        }
      }
    }

    if (routeType) {
      this.router.navigate([routeType]);
      return false;
    }

    return true;
  }

}
