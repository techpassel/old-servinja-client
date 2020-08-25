import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private router: Router) { }

  public logout(): void {
    localStorage.removeItem('access');
    this.router.navigate(['/login']);
  }

}
