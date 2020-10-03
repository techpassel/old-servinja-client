import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptDecryptService {
  private secretKey = environment.encryptionSecretKey;
  constructor() { }

  encrypt(data : any) : string{
    return CryptoJS.AES.encrypt(JSON.stringify(data), this.secretKey.trim()).toString();
  }

  decrypt(encryptedText : string) {
    const bytes = CryptoJS.AES.decrypt(encryptedText, this.secretKey.trim());
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  }

}
