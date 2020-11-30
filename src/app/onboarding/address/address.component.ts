import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StoreService } from 'src/services/common/store.service';
import { NotificationUtil } from 'src/utils/notification.util';
import { OnBoardingRoutes, StateAndDistrict } from 'src/utils/common.util';
import { Address } from '../../../models/address.model';
import { CommonService } from '../../../services/common/common.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss', '../onboarding.component.scss']
})
export class AddressComponent implements OnInit {

  states = StateAndDistrict;
  submitted = false;
  addressForm: FormGroup;
  districts: Array<string> = [];
  addressDetails = new Address();
  addressTypes = ['Home', 'Office', 'Other'];
  @Output() moveToNextStep = new EventEmitter();
  constructor(
    private commonService: CommonService,
    private formBuilder: FormBuilder,
    private storeService: StoreService,
    private notify: NotificationUtil
  ) { }

  ngOnInit(): void {
    this.initializeAddressForm();
    this.getAddress$();
  }

  initializeAddressForm(): void {
    this.addressForm = this.formBuilder.group({
      address: ['', Validators.required],
      state: ['', Validators.required],
      district: ['', Validators.required],
      city: ['', Validators.required],
      pin: ['', Validators.required],
      landmark: [''],
      type: ['', Validators.required]
    });
  }

  /**
   * Getter for easy access to form fields
   */
  get f(): any { return this.addressForm.controls; }

  /**
   * To get address from from database, if it was previously saved.
   */
  getAddress$(): void {
    const userId = this.storeService.getUserId();
    this.commonService.getDefaultAddress(userId).subscribe(
      (response) => {
        const res: any = response;
        if (res.status === 'success') {
          const adr: any = res.address;
          delete adr.user;
          this.addressDetails = adr;
          const state = this.addressDetails.state;
          this.loadDistricts(state);
          this.addressForm.patchValue(this.addressDetails);
        } else if (res.status === 'error') {
          this.notify.showError('Some error occured. Please try again');
        }
      },
      (error) => {
        console.log(error, 'error');
      });
  }

  /**
   * To get user details
   */
  getInputValues(): any {
    return {
      address: this.addressForm.value.address,
      state: this.addressForm.value.state,
      district: this.addressForm.value.district,
      city: this.addressForm.value.city,
      pin: this.addressForm.value.pin,
      landmark: this.addressForm.value.landmark,
      type: this.addressForm.value.type
    };
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.addressForm.invalid) {
      return;
    }

    const values: any = this.getInputValues();
    this.addressDetails.address = values.address;
    this.addressDetails.state = values.state;
    this.addressDetails.district = values.district;
    this.addressDetails.city = values.city;
    this.addressDetails.pin = values.pin;
    this.addressDetails.landmark = values.landmark;
    this.addressDetails.type = values.type;
    this.addressDetails.default = true;
    this.saveAddress$();
  }

  saveAddress$(): void {
    const adrObj = {
      address: this.addressDetails,
      userId: this.storeService.getUserId()
    };
    delete adrObj.address.userId;

    this.commonService.saveAddress(adrObj).subscribe(
      (response) => {
        if (response === 'success') {
          this.storeService.updateOnboardingStage(4);
          this.notify.showSuccess('Address saved successfully');
          this.moveToNextStep.emit(4);
        } else {
          this.notify.showError('Some error occured. Please try again');
        }
      },
      (error) => {
        console.log(error, 'error');
      }
    );
  }

  loadDistricts(state): void {
    // const state = event.target.value;
    const districts = this.states.find(e => e.state === state);
    this.addressForm.get('district').setValue('');
    this.districts = districts.districts;
  }
}
