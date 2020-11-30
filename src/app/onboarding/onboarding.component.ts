import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { StoreService } from 'src/services/common/store.service';
import { OnBoardingRoutes } from 'src/utils/common.util';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss']
})
export class OnboardingComponent implements OnInit {
  application = environment.application;
  onboardingStage: number;
  currentRouteIndex: number;
  nextProcessing = false;
  previousProcessing = false;
  constructor(
    private storeService: StoreService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.onboardingStage = this.storeService.getOnboardingStage();
    this.currentRouteIndex = this.storeService.getOnboardingCurrentRouteIndex();
  }

  /**
   * To navigate onto next step.
   */
  navigateNext(): void {
    this.nextProcessing = true;
    if (this.currentRouteIndex <= (OnBoardingRoutes.length - 2)) {
      const nextRoute = OnBoardingRoutes[++this.currentRouteIndex];
      this.router.navigate(['/onboard/' + nextRoute]);
    } else {
      this.router.navigate(['/customer']);
    }
    this.nextProcessing = false;
  }

  /**
   * To navigate back in previous step
   */
  navigateBack(): void {
    this.previousProcessing = true;
    if (this.currentRouteIndex >= 1) {
      const nextRoute = OnBoardingRoutes[--this.currentRouteIndex];
      this.router.navigate(['/onboard/' + nextRoute]);
    }
    this.previousProcessing = false;
  }

  /**
   * To signout from the application
   */
  signout(): any {
    this.storeService.logout();
  }

  /**
   * To communicate with child components.
   * The router-outlet directive exposes two events : "activate" — emits any time a new component is instantiated & "deactivate" — emits when the component is destroyed.
   * We can bind these events with any function(see html-page router-outlet tag for details) in which we can get 'child component reference' as argument as you can see in below function.
   * So using this child component reference you can communicate with child component.There can be communication from 'parent-to-child' as well as 'child-to-parent'.
   */
  onActivate(componentReference): void {
    // For parent-to-child - To trigger any function in child component.For example to trigger a function in child component by name 'anyFunction()'
    // componentReference.anyFunction();
    // For child-to-parent - To get data passed by triggering event from child component throw router-outlet
    componentReference.moveToNextStep?.subscribe((desiredOnboardingStage) => {
      if (this.onboardingStage < desiredOnboardingStage || desiredOnboardingStage === 0) {
        this.storeService.updateOnboardingStage(desiredOnboardingStage);
        this.onboardingStage = desiredOnboardingStage;
      }
      this.navigateNext();
    });
  }

}
