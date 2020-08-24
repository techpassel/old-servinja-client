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
      onboardingStage = data?.onboardingstage;
      const isExpired = token ? this.helper.isTokenExpired(token) : true;
      if (token && !isExpired) {
        if (onboardingStage == 0) {
          let rolesInString = data?.roles;
          let rolesInArray = rolesInString?.split(",")?.map(e => e.trim());
          //Following line needs to be modified incase other usertypes are added in future.
          routeType = rolesInArray.includes('admin')?'/admin': rolesInArray.includes('customer')?'/customer':null;
        } else {
          routeType = '/onboard';
        }
      }
    }

    if(routeType)
    {
      console.log(routeType,"navigation to other route from authroute");
      
      this.router.navigate([routeType]);
      return false;
    }

    return true;
  }

}
