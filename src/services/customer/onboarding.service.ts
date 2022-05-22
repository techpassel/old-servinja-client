import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { StoreService } from '../common/store.service';
import { OnBoardingRoutes } from 'src/utils/common.util';

const headers = new HttpHeaders(
  { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
);

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {
  baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient, private storeService: StoreService) { }

  getCustomerDetails(userId): any {
    // const params = new HttpParams().append('userId', userId);
    // return this.http.get(this.baseApiUrl + '/onboard/get-user-details/'+userId, { headers: headers, responseType: 'text' });
    // return this.http.get(this.baseApiUrl + '/onboard/get-user-details', { headers, params, responseType: 'text' });
    return this.http.get(this.baseApiUrl + '/onboard/get-customer-details?userId=' + userId, { headers });
  }

  saveProfileCompletionData(data: any): any {
    return this.http.post(this.baseApiUrl + '/onboard/save-profile-completion-data', data, { headers, responseType: 'text' });
  }

  sendOtp(data): any {
    return this.http.post(this.baseApiUrl + '/onboard/send-otp', data, { headers, responseType: 'text' });
  }

  verifyOtp(data): any {
    return this.http.post(this.baseApiUrl + '/onboard/verify-otp', data, { headers, responseType: 'text' });
  }
}
