import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LayoutService } from 'src/services/common/layout.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  application = environment.application;
  isSideNavHidden: boolean;
  cartIcon = '../../assets/images/cart1.png';
  bellIcon = '../../assets/images/bell.png';
  cartItemCount = 0;
  notificationCount = 0;
  show = false;

  constructor(public layoutService: LayoutService) { }

  ngOnInit(): void {
    this.getSideNavStatus();
    setTimeout(() => {
      this.cartItemCount = 4;
      this.notificationCount = 5;
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


}

