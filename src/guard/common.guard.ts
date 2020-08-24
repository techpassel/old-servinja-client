import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtHelperService } from "@auth0/angular-jwt";
import { EncryptDecryptService } from 'src/services/common/encrypt-decrypt.service';

@Injectable({
  providedIn: 'root'
})
export class CommonGuard implements CanActivate {
  constructor(private router: Router, private helper: JwtHelperService, private encriptionService: EncryptDecryptService) { };

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let token = null;
    let onboardingStage = null;
    let access = localStorage.getItem('access');
    if (access) {
      let data = this.encriptionService.decrypt(access);
      token = data?.token;
      onboardingStage = data?.onboardingstage;

      if (token && token != "") {
        const isExpired = this.helper.isTokenExpired(token);
        if (!isExpired) {
          if (onboardingStage != 0) {
            this.router.navigate(['/onboard']);
            return false;
          }
          return true;
        }
      }
      
      else localStorage.removeItem('access');
    }

    this.router.navigate(['/login']);
    return false;
  }
}
