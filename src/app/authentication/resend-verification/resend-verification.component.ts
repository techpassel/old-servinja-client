import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/services/authentication/authentication.service';


@Component({
  selector: 'app-resend-verification',
  templateUrl: './resend-verification.component.html',
  styleUrls: ['./resend-verification.component.scss', '../authentication.component.scss']
})
export class ResendVerificationComponent implements OnInit {
  userId: number = null;
  responseType: string = null;
  constructor(private activatedRouter: ActivatedRoute, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.getQueryParams$();
  }

  getQueryParams$(): any {
    this.activatedRouter.paramMap.subscribe(params => {
      this.userId = parseInt(params.get('id'), 10);
      this.resendVerificationEmail$();
    });
  }

  resendVerificationEmail$(): any {
    this.responseType = 'initialSending';
    this.authService.resendVerificationEmail(this.userId).subscribe(
      response => {
        const res: any = response;
        this.responseType = response.type;
      },
      error => {
        this.responseType = 'error';
      });
  }

}
