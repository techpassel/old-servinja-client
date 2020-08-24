import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit {
  application = environment.application;

  constructor(private activatedRouter: ActivatedRoute, private authenticationService: AuthenticationService) { }
  responseType: string = null;
  ngOnInit(): void {
    this.getQueryParams$();
  }

  getQueryParams$() {
    this.activatedRouter.paramMap.subscribe(params => {
      this.verifyEmail$(params.get('token'));
    });
  }

  verifyEmail$(token): void {
    this.authenticationService.verifyEmail(token).subscribe(response => {      
      this.responseType = response;
    });
  }

}
