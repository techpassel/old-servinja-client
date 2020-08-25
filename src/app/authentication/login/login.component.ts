import { Component, OnInit } from '@angular/core';
import { UserModel } from 'src/models/user.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/services/authentication/authentication.service';
import { Router } from '@angular/router';
import { GoogleLoginProvider, FacebookLoginProvider, SocialAuthService } from 'angularx-social-login';
import { EncryptDecryptService } from "src/services/common/encrypt-decrypt.service";
import { OnBoardingRoutes } from 'src/utils/common.util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../authentication.component.scss']
})
export class LoginComponent implements OnInit {

  user: UserModel = new UserModel();
  submitted = false;
  signinForm: FormGroup;
  loginResponseType: string = null;
  resendEmailKey: string;
  isProcessing = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: SocialAuthService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private encriptionService : EncryptDecryptService
  ) { }

  ngOnInit(): void {
    this.initializeSigninForm();
    this.setSocialUser();
    // this.getSocialUserSigninResponse();
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
    let usernameField = this.signinForm.get('username');
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
  get f() { return this.signinForm.controls; }

  /**
   * Called on form submission.
   */
  onSubmit() {
    this.submitted = true;

    // return from here if form is invalid
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
        this.loginResponseType = res.type;
        if (res.type === 'success') {
          let usersecret = {};          
          usersecret['token'] = res.token;
          usersecret['roles'] = res.roles;
          usersecret['onboardingStage'] = parseInt(res.onboardingStage);
          let enc = this.encriptionService.encrypt(usersecret);         
          localStorage.setItem('access', enc);
          
          let routeType = null;
          if(parseInt(res.onboardingStage) == 0){
            routeType = res.roles.includes('admin') ? '/admin' : '/customer';
          } else {
            routeType = "/onboard/" + OnBoardingRoutes[parseInt(res.onboardingStage) - 1];
          }
          this.router.navigate([routeType]);
        }
        this.isProcessing = false;
      },
      (error) => {
        this.isProcessing = false;
      }
    );
  }

  /**
   * Called on google signin
   */
  signInWithGoogle(): void {
    this.submitted = true;
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  /**
   * Called on facebook signin
   */
  signInWithFB(): void {
    this.submitted = true;
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID);
  }

  /**
   * Called on signout from any social platforms
   */
  signOutSocialAccount(): void {
    this.authService.signOut();
  }

  /**
   * Set value on user from social platforms.
   */
  setSocialUser(): void {
    this.authService.authState.subscribe(user => {
      if (this.submitted === true) {
        if (user) {
          const socialUser: any = {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            roles: 'customer'
          };
          this.socialUserSignin$(socialUser);
        } else {
          this.user = new UserModel();
        }
      }
    });
  }

  socialUserSignin$(user): void {
    // this.authenticationService.signInSocialUser(user).subscribe(response => {
    //   this.signOutSocialAccount();
    //   this.router.navigate(['/customer']);
    // });
  }

  onKeyUp(type) {
    if ((type === 'username' && this.loginResponseType === 'invalidUser') ||
      (type === 'pass' && this.loginResponseType === 'incorrectPassword')) {
      this.loginResponseType = null;
    }
  }


}
