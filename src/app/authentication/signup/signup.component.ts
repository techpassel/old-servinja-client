import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {UserModel} from '../../../models/user.model';
import { Router } from '@angular/router';
import {AuthenticationService} from '../../../services/authentication/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss', '../authentication.component.scss']
})
export class SignupComponent implements OnInit {
  user: UserModel = new UserModel();
  signupForm: FormGroup;
  submitted = false;
  isPasswordMismatched = false;
  emailExists = false;
  phoneExists = false;
  isUserRegistered = false;
  isProcessing = false;
  errorInResponse = false;

  constructor(private router: Router, private formBuilder: FormBuilder, private authenticationService: AuthenticationService) { }

  ngOnInit(): void {
    this.initializeSignupForm();
  }

  /**
   * To initialize form validation rules.
   */
  initializeSignupForm(): void {
    this.signupForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required, Validators.compose([Validators.minLength(10), Validators.maxLength(10)])]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Getter for easy access to form fields
   */
  get f() { return this.signupForm.controls; }

  /**
   * To hide error message instantly if it is being displayed after previous submission and user change the value.
   */
  onKeyUp(type) {
    if (type === 'phone') { this.phoneExists = false; }
    if (type === 'email') { this.emailExists = false; }
    if (type === 'password') { this.isPasswordMismatched = false; }
  }

  /**
   * Called on form submission.
   */
  onSubmit() {
    this.submitted = true;
    
    // return from here if form is invalid.
    if (this.signupForm.invalid) {
      return;
    }

    //return from here if password and confirm password don't match.
    if (this.signupForm.value.password !== this.signupForm.value.confirmPassword) {
      this.isPasswordMismatched = true;
      return;
    }
    this.isProcessing = true;
    this.user.firstName = this.signupForm.value.firstName;
    this.user.lastName = this.signupForm.value.lastName;
    this.user.email = this.signupForm.value.email;
    this.user.phone = this.signupForm.value.contactNumber;
    this.user.password = this.signupForm.value.password;
    this.user.roles = 'customer';
    this.signup$();
  }
  /**
   * Called from onSubmit() method after verifying validation rules to make server call.
   */
  signup$(): void {
    this.errorInResponse = false;
    this.authenticationService.signup(this.user).subscribe(response => {
      if (response === 'duplicateEmail') { this.emailExists = true; }
      else if (response === 'duplicatePhone') { this.phoneExists = true; }
      else if (response === 'duplicateEmailAndPhone') { this.emailExists = true; this.phoneExists = true; }
      else if (response === 'success') {
        this.isUserRegistered = true;
      } else {
        this.errorInResponse = true;
      }
      this.isProcessing = false;
    },
      error => {
        this.isProcessing = false;
        this.errorInResponse = true;
      });
  }

}
