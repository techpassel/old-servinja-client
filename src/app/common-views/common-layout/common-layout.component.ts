import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LayoutService } from 'src/services/common/layout.service';

@Component({
  selector: 'app-common-layout',
  templateUrl: './common-layout.component.html',
  styleUrls: ['./common-layout.component.scss', '../../customer/customer.component.scss']
})
export class CommonLayoutComponent implements OnInit {

  application = environment.application;
  isSideNavHidden: boolean;
  cartIcon = '../../assets/images/cart1.png';
  bellIcon = '../../assets/images/bell.png';
  cartItemCount = 0;
  notificationCount = 0;
  show = false;

  constructor(public layoutService: LayoutService, private router: Router) { }

  ngOnInit(): void {
    this.getSideNavStatus();
    setTimeout(() => {
      this.cartItemCount = 4;
      this.notificationCount = 3;
    }, 1000);
  }

  getSideNavStatus(): void {
    const sub: any = this.layoutService.hideSideNav.subscribe((val) => {
      this.isSideNavHidden = val;
    });
  }

  hideOverlay(event): void {
    const currentElement = event.target;
    const notificationPopupElement = document.getElementById('notification-popup');
    if (!notificationPopupElement.contains(currentElement)) {
      this.show = false;
    }
  }

  test(): void {
    console.log('calling');
  }

  showCart(): void {
    this.router.navigateByUrl('/customer/cart');
  }

}
