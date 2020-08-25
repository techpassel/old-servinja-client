import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// const headers = new HttpHeaders(
//   { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',  'Authorization': 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhYW1hbjQyMkBnbWFpbC5jb20iLCJleHAiOjE1OTgzMjkzMzksImlhdCI6MTU5ODMyNzE3OX0.vCFiq7CuJjjnTEFE8A3-SLoXTtBrZtoYjHlgp5AElfUkv-mDNdI2UbjYid9yUhWX-j3Q5JtmrZFO8nSHhTCZOg' });

const headers = new HttpHeaders(
  { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' });

@Injectable({
  providedIn: 'root'
})
export class OnboardingService {

  baseApiUrl = environment.baseApiUrl;

  constructor(private http: HttpClient) { }

  testOnboard(){
    return this.http.post(this.baseApiUrl + '/onboard/testUrl',{}, { headers, responseType: 'text' });
  }
}
