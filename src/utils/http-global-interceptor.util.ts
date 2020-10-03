import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationUtil } from './notification.util';
import { StoreService } from 'src/services/common/store.service';

@Injectable({
  providedIn: 'root'
})
export class HttpGlobalInterceptorService implements HttpInterceptor {

  constructor(private notify: NotificationUtil, private storeService: StoreService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        if (error?.status === 403){
          this.notify.showWarning('Your token is invalid or it has been expired. Please login again.');
          this.storeService.logout();
          return;
        }
        this.notify.showError('Some error occured. Please try again.');
        return throwError(error.message);
      })
    );
  }
}
