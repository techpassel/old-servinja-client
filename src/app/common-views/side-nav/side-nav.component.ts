import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  userName: string;
  constructor(
    public layoutService: LayoutService,
    public storeService: StoreService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.getSideNavStatus();
    this.setSideNavItems();
    // Temporary.Should be changed with original user name.
    this.userName = 'Aman Saurabh';
  }

  setSideNavItems(): void {
    const userRoles = this.storeService.getUserRoles();
    const mainRole = userRoles.includes('admin') ? 'admin' : userRoles;
    this.sideNavItems = SideNavLinks[mainRole];
  }

  getSideNavStatus(): void {
    const sub: any = this.layoutService.hideSideNav.subscribe((val) => {
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
