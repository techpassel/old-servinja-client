import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { StoreService } from '../common/store.service';

const headers = new HttpHeaders(
    { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
);


@Injectable({
    providedIn: 'root'
})
export class CommonService {
    baseApiUrl = environment.baseApiUrl;

    constructor(private http: HttpClient, private storeService: StoreService) { }

    saveAddress(data: any): any {
        return this.http.post(this.baseApiUrl + '/common/save-address', data, { headers, responseType: 'text' });
    }

    getDefaultAddress(userId: number): any {
        return this.http.get(this.baseApiUrl + '/common/get-default-address/' + userId, { headers });
    }

    storeUserDocuments(data): any {
        return this.http.post(this.baseApiUrl + '/common/store-user-documents', data, { headers: { 'Access-Control-Allow-Origin': '*' }, responseType: 'text' });
    }
}
