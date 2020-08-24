import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs/internal/Observable';

const headers = new HttpHeaders(
  { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  signup(user) {
    return this.http.post(this.baseApiUrl + '/auth/signup', user, { headers, responseType: 'text' });
  }

  verifyEmail(token) {
    return this.http.post(this.baseApiUrl + '/auth/verify-email', token, { headers, responseType: 'text' });
  }

  signInSocialUser(user) {
    return "success";
    //return this.http.post('http://localhost:8090/auth/socialUserlogin', user);
  }

  signin(user) {
    return this.http.post(this.baseApiUrl + '/auth/signin', user)
  }

}