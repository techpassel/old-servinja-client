import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StoreService } from 'src/services/common/store.service';
import { OnboardingService } from 'src/services/customer/onboarding.service';
import { NotificationUtil } from 'src/utils/notification.util';

@Component({
  selector: 'app-mobile-verification',
  templateUrl: './mobile-verification.component.html',
  styleUrls: ['./mobile-verification.component.scss', '../onboarding.component.scss']
})
export class MobileVerificationComponent implements OnInit {
  phone: string;
  otp: string;
  showOtpComponent = false;
  displayMessage = 'Do you want to update number? Please move to previous step.';
  isSendOtpBtnDisabled = false;
  timeCount = 0;
  setIntervalObj: any;
  @Output() moveToNextStep = new EventEmitter();
  config = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
    inputStyles: {
      width: '35px',
      height: '35px'
    }
  };

  constructor(
    private onboardingService: OnboardingService,
    private storeService: StoreService,
    private notify: NotificationUtil
  ) { }

  ngOnInit(): void {
    this.getCustomerDetails$();
  }

  onOtpChange(otp): void {
    this.otp = otp;
  }

  getCustomerDetails$(): void {
    const userId: number = this.storeService.getUserId();
    this.onboardingService.getCustomerDetails(userId).subscribe(
      (response) => {
        const res: any = response;
        if (res.type === 'success') {
          this.phone = res?.customer?.user?.phone;
        }
      },
      (error) => {
        console.log(error, 'error');
      }
    );
  }

  sendOtp$(): void {
    // It should be set true when otp is sent.
    const data: any = {
      userId: this.storeService.getUserId(),
      phone: this.phone
    };
    this.onboardingService.sendOtp(data).subscribe(
      (response) => {
        if (response === 'success') {
          this.notify.showSuccess('OTP has been sent to your registered mobile.Please verify');
          this.showOtpComponent = true;
          this.disableSendOtpBtn();
        } else {
          this.notify.showError('Some error occured.Please try again');
        }
      },
      (error) => {
        console.log(error, 'error');
      }
    );
  }

  disableSendOtpBtn(): void {
    this.isSendOtpBtnDisabled = true;
    this.timeCount = 180;
    this.displayMessage = 'Otp has been sent to your registered mobile.You can resend OTP after ' + this.timeCount + (this.timeCount > 1 ? ' seconds.' : ' second.');
    this.setIntervalObj = setInterval(() => {
      if (this.timeCount > 0) {
        this.timeCount--;
      } else {
        this.displayMessage = 'Now you can resend OTP. Please move to previous step if you want to update number.';
        this.isSendOtpBtnDisabled = false;
        clearInterval(this.setIntervalObj);
      }
    }, 1000);
  }

  verifyOtp$(): void {
    if (this.otp.length === 6) {
      const data = {
        userId: this.storeService.getUserId(),
        token: this.otp
      };
      this.onboardingService.verifyOtp(data).subscribe(
        (response) => {
          if (response === 'success') {
            this.storeService.updateOnboardingStage(3);
            this.notify.showSuccess('Phone number verified successfully');
            this.moveToNextStep.emit();
          } else if (response === 'invalid') {
            this.notify.showError('Your OTP is invalid or expired. Please try again.');
          } else {
            this.notify.showError('Some error occured. Please try again');
          }
        },
        (error) => {
          console.log(error, 'error');
        }
      );
    } else {
      this.notify.showError('Please enter 6 digit valid OTP');
    }
  }

}
