import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/services/authentication/authentication.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss', '../authentication.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private authService: AuthenticationService) { }

  forgetPasswordForm: FormGroup;
  submitted = false;
  responseType: string = null;
  userNameType: string = null;
  resendEmailKey: number = null;
  isProcessing = false;

  ngOnInit(): void {
    this.initializeForgetPasswordForm();
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
  initializeForgetPasswordForm(): void {
    this.forgetPasswordForm = this.formBuilder.group({
      username: ['', Validators.required]
    });
  }

  /**
   * Dynamically adding validation rule for phone and email based on what user have entered.
   */
  setEmailPhoneValidator(): void {
    const usernameField = this.forgetPasswordForm.get('username');
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
  get f(): any { return this.forgetPasswordForm.controls; }

  onKeyUp(type): void {
    this.responseType = null;
    this.userNameType = null;
    this.resendEmailKey = null;
  }

  onSubmit(): void {
    this.submitted = true;

    // Return from here if all fields of the form is not valid
    if (this.forgetPasswordForm.invalid) {
      return;
    }

    this.isProcessing = true;
    const username = this.forgetPasswordForm.value.username;

    this.authService.sendChangePasswordLink(username).subscribe(
      (response) => {
        const res: any = response;
        this.responseType = res.type;
        if (this.responseType === 'userNotVerified') {
          this.resendEmailKey = res.userId ? res.userId : null;
        }
        this.isProcessing = false;
      },
      (error) => {
        this.responseType = 'error';
        this.isProcessing = false;
      }
    );

  }

}
