import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

const headers = new HttpHeaders(
  { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
);

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseApiUrl = environment.baseApiUrl;
  constructor(private http: HttpClient) { }

  signup(user): any {
    return this.http.post(this.baseApiUrl + '/auth/signup', user, { headers, responseType: 'text' });
  }

  verifyEmail(token): Observable<string> {
    return this.http.post(this.baseApiUrl + '/auth/verify-email', token, { headers, responseType: 'text' });
  }

  signinSocialUser(user): any {
    return this.http.post(this.baseApiUrl + '/auth/signin-social-user', user, { headers });
  }

  signin(user): any {
    return this.http.post(this.baseApiUrl + '/auth/signin', user, { headers });
  }

  resendVerificationEmail(userId): any {
    return this.http.post(this.baseApiUrl + '/auth/resend-verification-email', userId, { headers });
  }

  sendChangePasswordLink(username): any {
    return this.http.post(this.baseApiUrl + '/auth/send-change-password-link', username, { headers });
  }

  getResetPasswordTokenDetals(token): any {
    return this.http.get(this.baseApiUrl + '/auth/get-reset-password-token-details/' + token, { headers });
  }

  resetPassword(data): any {
    return this.http.post(this.baseApiUrl + '/auth/reset-password', data, { headers });
  }
}
