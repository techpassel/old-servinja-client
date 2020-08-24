import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { EncryptDecryptService } from 'src/services/common/encrypt-decrypt.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private router: Router, private encriptionService: EncryptDecryptService) { };
  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    let access = localStorage.getItem('access');
    if (access) {
      let data = this.encriptionService.decrypt(access);
      let rolesInString = data?.roles;
      let adminRole = rolesInString?.split(",")?.find(e => e.trim() == "admin");
      if (adminRole) {
        return true;
      }
    }

    localStorage.removeItem('access');
    this.router.navigate(['/login']);
    return false;
  }

}
