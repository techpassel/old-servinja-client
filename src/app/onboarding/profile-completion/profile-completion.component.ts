import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StoreService } from 'src/services/common/store.service';
import { OnboardingService } from 'src/services/customer/onboarding.service';
import { NotificationUtil } from 'src/utils/notification.util';

@Component({
  selector: 'app-profile-completion',
  templateUrl: './profile-completion.component.html',
  styleUrls: ['./profile-completion.component.scss', '../onboarding.component.scss']
})
export class ProfileCompletionComponent implements OnInit {
  profileCompletionForm: FormGroup;
  userDetails: any;
  onboardingStage: number;
  submitted = false;
  phoneExists = false;
  enableNext: boolean;
  @Output() onboardingStageUpdated = new EventEmitter();
  @Output() moveToNextStep = new EventEmitter();

  constructor(
    private onboardingService: OnboardingService,
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private notify: NotificationUtil
  ) { }

  ngOnInit(): void {
    this.getCustomerDetails$();
    this.initializeProfileCompletionForm();
  }

  /**
   * To get user details on page load.
   */
  getCustomerDetails$(): void {
    const userId: number = this.storeService.getUserId();
    this.onboardingService.getCustomerDetails(userId).subscribe(
      (response) => {
        const res: any = response;
        if (res.type === 'success') {
          const requiredKeys = ['firstName', 'lastName', 'email', 'phone', 'age', 'gender'];
          const user: any = {};
          let incompleteCount = 0;

          requiredKeys.forEach(e => {
            if (res.customer?.hasOwnProperty(e)) {
              if (res.customer[e] && res.customer[e] !== '') {
                user[e] = res.customer[e];
              } else {
                incompleteCount++;
              }
            }
            else if (res.customer?.user?.hasOwnProperty(e)) {
              if (res.customer.user[e] && res.customer.user[e] !== '') {
                user[e] = res.customer.user[e];
              } else {
                incompleteCount++;
              }
            }
          });
          this.onboardingStage = res.customer.onboardingStage;
          this.userDetails = user;
          this.userDetails.id = res.customer.id;
          // To set values of all fileds in reactive form
          this.profileCompletionForm.patchValue(user);
          // If you have all values then you can use setValue() also in place of patchValue().
        } else {
          this.notify.showWarning('User details not found. Please fill all details.');
        }
      },
      (error) => {
        console.log(error, 'error');
      }
    );
  }

  /**
   * To initialize form validation rules.
   */
  initializeProfileCompletionForm(): void {
    this.profileCompletionForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.compose([Validators.minLength(10), Validators.maxLength(10)])]],
      age: ['', Validators.required],
      gender: ['', Validators.required]
    });
  }

  /**
   * Getter for easy access to form fields
   */
  get f(): any { return this.profileCompletionForm.controls; }

  /**
   * Called when any field value is updated.To enable or disable next button.
   */
  valueUpdated(): void {
    if (this.enableNext && this.checkIfValuesModified()) {
      this.onboardingStageUpdated.emit(false);
    }
  }

  /**
   * To check if any value is changed from previous values
   */
  checkIfValuesModified(): boolean {
    const user = this.getInputValues();
    let modificationCount = 0;
    for (const key in user) {
      if (user[key] !== this.userDetails[key]) {
        modificationCount++;
      }
    }
    return modificationCount === 0 ? false : true;
  }

  /**
   * To get user details
   */
  getInputValues(): any {
    return {
      firstName: this.profileCompletionForm.value.firstName,
      lastName: this.profileCompletionForm.value.lastName,
      phone: this.profileCompletionForm.value.phone,
      age: this.profileCompletionForm.value.age,
      gender: this.profileCompletionForm.value.gender
    };
  }
  /**
   * Called on form submission.
   */
  onSubmit(): void {
    this.submitted = true;
    if (this.profileCompletionForm.invalid) {
      return;
    }

    if (this.checkIfValuesModified()) {
      // To store updated data in database
      this.saveProfileCompletionData$();
    } else {
      // To navigate to next page
      this.moveToNextStep.emit();
    }
  }

  /**
   * To store updated data in database and move to next step if successful.
   */
  saveProfileCompletionData$(): any {
    const user = this.getInputValues();
    user.id = this.userDetails?.id;
    this.onboardingService.saveProfileCompletionData(user).subscribe(
      (response) => {
        const res: string = response;
        if (res === 'duplicatePhone') {
          this.phoneExists = true;
          this.notify.showError('Phone number is already registered.Please provide some other number');
          return;
        } else if (res === 'error') {
          this.notify.showError('Some error occured. Please try again');
        } else {
          this.storeService.updateOnboardingStage(2);
          this.notify.showSuccess('Profile updated successfully');
          this.moveToNextStep.emit();
        }
      },
      (error) => {
        console.log(error, 'error');
      }
    );
  }

}
