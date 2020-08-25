import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from "./notification.util";
import { CommonService } from 'src/services/common/common.service';

@Injectable({
  providedIn: 'root'
})
export class HttpGlobalInterceptorService implements HttpInterceptor {

  constructor(private notify: NotificationService, private commonService: CommonService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        if(error?.status == 403){
          this.notify.showWarning("Your token is invalid or it has been expired. Please login again.");
          this.commonService.logout();
          return;
        }        
        this.notify.showError("Some error occured. Please try again.");
        return throwError(error.message);
      })
    )
  }
}
