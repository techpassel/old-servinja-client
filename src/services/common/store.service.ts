import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { OnBoardingRoutes } from 'src/utils/common.util';
import { EncryptDecryptService } from './encrypt-decrypt.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(
    private router: Router,
    private encriptionService: EncryptDecryptService,
    private helper: JwtHelperService) { }

  public saveAccessToken(userSecret): void {
    const enc = this.encriptionService.encrypt(userSecret);
    localStorage.setItem('access', enc);
  }

  public updateOnboardingStage(newStage): void {
    const data = this.getDecryptedToken();
    if (data?.onboardingStage) {
      data.onboardingStage = newStage;
    }
    this.saveAccessToken(data);
  }

  public logout(): void {
    localStorage.removeItem('access');
    this.router.navigate(['/login']);
  }

  private getDecryptedToken(): any {
    const access = localStorage.getItem('access');
    const data = this.encriptionService.decrypt(access);
    return data;
  }

  getUserId(): any {
    const data = this.getDecryptedToken();
    const token = data?.token;
    return this.helper.decodeToken(token)?.id;
  }

  getOnboardingStage(): any {
    const data = this.getDecryptedToken();
    return data?.onboardingStage;
  }

  getUserRoles(): any {
    const data = this.getDecryptedToken();
    return data?.roles;
  }

  getOnboardingCurrentRouteIndex(): number {
    const currentRouteAsArray = this.router.url.split('/');
    let currentRouteIndex = 0;
    if (currentRouteAsArray.length === 3 && currentRouteAsArray[currentRouteAsArray.length - 1] !== 'onboard') {
      currentRouteIndex = OnBoardingRoutes.indexOf(currentRouteAsArray[currentRouteAsArray.length - 1]);
    }
    return currentRouteIndex;
  }

}
