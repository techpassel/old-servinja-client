import { Component, OnInit } from '@angular/core';
import { OnboardingService } from "src/services/customer/onboarding.service";

@Component({
  selector: 'app-profile-completion',
  templateUrl: './profile-completion.component.html',
  styleUrls: ['./profile-completion.component.scss']
})
export class ProfileCompletionComponent implements OnInit {

  constructor(private onboardingService: OnboardingService) { }

  ngOnInit(): void {
    this.testo$();
  }

  testo$(): void {
    this.onboardingService.testOnboard().subscribe(
    (response) => {
      console.log(response,"reasponse");
      
    },
    (error) => {
      console.log(error, "error");
      
    }
    );
  }

}
