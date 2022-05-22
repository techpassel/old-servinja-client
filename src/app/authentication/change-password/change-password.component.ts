import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication/authentication.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss', '../authentication.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  constructor(
    private activatedRouter: ActivatedRoute,
    private authService: AuthenticationService,
    private formBuilder: FormBuilder
  ) { }
  token: string;
  submitted = false;
  responseType: string = null;
  resetPasswordForm: FormGroup;
  isPasswordMismatched = false;
  isProcessing = false;

  ngOnInit(): void {
    this.initializeResetPasswordForm();
    this.activatedRouter.paramMap.subscribe(params => {
      this.token = params.get('token');
      this.getResetPasswordTokenDetals$();
    });
  }

  getResetPasswordTokenDetals$(): void {
    this.authService.getResetPasswordTokenDetals(this.token).subscribe(
      (response) => {
        const res: any = response;
        this.responseType = res.type;
      },
      (error) => {
        if (this.responseType !== 'tempError') {
          this.responseType = 'tempError';
          this.getResetPasswordTokenDetals$();
        } else {
          this.responseType = 'invalid';
        }
      }
    );
  }

  /**
   * To initialize form validation rules.
   */
  initializeResetPasswordForm(): void {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Getter for easy access to form fields
   */
  get f(): any { return this.resetPasswordForm.controls; }

  onKeyUp(): void {
    this.isPasswordMismatched = false;
  }

  /**
   * Called on form submission.
   */
  onSubmit(): void {
    this.submitted = true;

    if (this.resetPasswordForm.invalid) {
      return;
    }

    const password = this.resetPasswordForm.value.password;
    const resetPassword = this.resetPasswordForm.value.confirmPassword;
    if (password !== resetPassword) {
      this.isPasswordMismatched = true;
      return;
    }

    const data = {
      token: this.token,
      password
    };

    this.isProcessing = true;
    this.authService.resetPassword(data).subscribe(
      (response) => {
        const res: any = response;
        this.responseType = res.type;
        this.isProcessing = false;
      },
      (error) => {
        this.responseType = 'error';
        this.isProcessing = false;
      }
    );

  }

}
