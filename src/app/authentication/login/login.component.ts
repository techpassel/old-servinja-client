import { Component, OnInit } from '@angular/core';
import { User } from 'src/models/user.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/services/authentication/authentication.service';
import { Router } from '@angular/router';
import { GoogleLoginProvider, FacebookLoginProvider, SocialAuthService } from 'angularx-social-login';
import { OnBoardingRoutes } from 'src/utils/common.util';
import { StoreService } from 'src/services/common/store.service';
import { NotificationUtil } from 'src/utils/notification.util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../authentication.component.scss']
})
export class LoginComponent implements OnInit {

  user: User = new User();
  submitted = false;
  signinForm: FormGroup;
  loginResponseType: string = null;
  resendEmailKey: number = null;
  isProcessing = false;
  userNameType: string = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: SocialAuthService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private storeService: StoreService,
    private notify: NotificationUtil
  ) { }

  ngOnInit(): void {
    this.initializeSigninForm();
    this.setSocialUser();
  }

  /**
   * Function to check if the given String is number or not.
   */
  isANumber(str): boolean {
    return !/\D/.test(str);
  }

  /**
   * To initialize form validation rules.
   */
  initializeSigninForm(): void {
    this.signinForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Dynamically adding validation rule for phone and email based on what user have entered.
   */
  setEmailPhoneValidator(): void {
    const usernameField = this.signinForm.get('username');
    if (this.isANumber(usernameField.value)) {
      usernameField.setValidators([Validators.required, Validators.compose([Validators.minLength(10), Validators.maxLength(10)])]);
    } else {
      usernameField.setValidators([Validators.required, Validators.email]);
    }
    usernameField.updateValueAndValidity();
  }

  /**
   * Getter for easy access to form fields
   */
  get f(): any { return this.signinForm.controls; }

  /**
   * Called on form submission.
   */
  onSubmit(): void {
    this.submitted = true;

    // Return from here if all fields of the form is not valid
    if (this.signinForm.invalid) {
      return;
    }

    this.isProcessing = true;
    const user = {
      username: this.signinForm.value.username,
      password: this.signinForm.value.password
    };
    this.signin$(user);
  }

  signin$(user): void {
    this.authenticationService.signin(user).subscribe(
      (response) => {
        const res: any = response;
        if (res.type === 'invalidUser') {
          this.userNameType = this.isANumber(user.username) ? 'phone' : 'email';
        } else if (res.type === 'userNotVerified') {
          this.resendEmailKey = res.userId;
        } else if (res.type === 'success') {
          this.processSigninData(res);
        }
        this.loginResponseType = res.type;
        this.isProcessing = false;
      },
      (error) => {
        this.notify.showError('Some error occured. Please try again.');
        this.isProcessing = false;
      }
    );
  }

  /**
   * To process signin data
   */
  processSigninData(res): void {
    const usersecret: any = {};
    usersecret.token = res.token;
    usersecret.roles = res.roles;
    usersecret.onboardingStage = parseInt(res.onboardingStage, 10);
    this.storeService.saveAccessToken(usersecret);
    let routeType = null;
    if (parseInt(res.onboardingStage, 10) === 0) {
      routeType = res.roles.includes('admin') ? '/admin' : '/customer';
    } else {
      routeType = '/onboard/' + OnBoardingRoutes[parseInt(res.onboardingStage, 10) - 1];
    }
    this.router.navigate([routeType]);
  }

  /**
   * Called on google signin
   */
  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  /**
   * Called on facebook signin
   */
  signInWithFB(): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  /**
   * Called after fetching data from social media platforms
   */
  socialSignOut(): void {
    this.authService.signOut();
  }

  /**
   * Set value on user from social platforms.
   */
  setSocialUser(): void {
    this.authService.authState.subscribe(user => {
      if (user) {
        const socialUser: any = {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        };
        this.socialUserSignin$(socialUser);
        this.socialSignOut();
      }
    });
  }

  socialUserSignin$(user): void {
    this.authenticationService.signinSocialUser(user).subscribe(response => {
      const res: any = response;
      if (res.type === 'success') {
        this.processSigninData(res);
      }
    });
  }

  onKeyUp(type): void {
    if ((type === 'username' && this.loginResponseType !== 'incorrectPassword') ||
      (type === 'pass' && this.loginResponseType === 'incorrectPassword')) {
      this.loginResponseType = null;
      this.userNameType = null;
      this.resendEmailKey = null;
    }
  }

}
