import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { throwError, of } from 'rxjs';
import { mergeMap, retry } from 'rxjs/operators';
import { CommonService } from 'src/services/common/common.service';
import { LayoutService } from 'src/services/common/layout.service';
import { StoreService } from 'src/services/common/store.service';
import { SideNavLinks } from 'src/utils/common.util';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  isSideNavHidden: boolean;
  sideNavItems: Array<any>;
  menImage = '../../../assets/images/men.png';
  womenImage = '../../../assets/images/women.png';
  gender: string;
  userName: string;
  mainRole: string;

  constructor(
    public layoutService: LayoutService,
    public storeService: StoreService,
    public router: Router,
    public commonService: CommonService
  ) { }

  ngOnInit(): void {
    const userRoles = this.storeService.getUserRoles();
    this.mainRole = userRoles.includes('admin') ? 'admin' : userRoles;
    this.getSideNavStatus();
    this.setSideNavItems();
    this.getUserNameAndGender();
  }

  getUserNameAndGender(): void {
    if (this.mainRole === 'admin') {
      this.userName = 'Admin';
      this.gender = 'male';
    } else {
      const userId: any = this.storeService.getUserId();
      // To retry if first request fails.
      const request = this.commonService.getUserNameAndGender(userId).pipe(
        mergeMap(value => {
          const val: any = value;
          if (val.type !== 'success') {
            return throwError('Error!');
          }
          return of(val);
        }),
        retry(1)
      );

      request.subscribe({
        next: val => {
          const res: any = val;
          if (res.type === 'success') {
            this.userName = res.lastName ? this.commonService.capitalizeFirstLetter(res.firstName) + ' ' + this.commonService.capitalizeFirstLetter(res.lastName) : this.commonService.capitalizeFirstLetter(res.firstName);
            this.gender = res.gender;
          }
        },
        error: val => console.log(`${val}: Retried 2 times then quit!`)
      });
    }
  }

  setSideNavItems(): void {
    this.sideNavItems = SideNavLinks[this.mainRole];
  }

  getSideNavStatus(): void {
    this.layoutService.hideSideNav.subscribe((val) => {
      this.isSideNavHidden = val;
    });
  }

  newRouteSelected(): void {
    if (window.matchMedia('(max-width: 575px)').matches) {
      this.layoutService.toggleSideNav();
    }
  }

  /**
   * To signout from the application
   */
  signout(): any {
    this.storeService.logout();
  }

}
