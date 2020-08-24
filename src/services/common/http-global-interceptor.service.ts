import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpGlobalInterceptorService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Need to handle situation if server respond with invalid token status.
    return next.handle(req).pipe(
      catchError((error) => {
        // console.log(error, "error in inteceptor");
        return throwError(error.message);
      })
    )
  }
}
