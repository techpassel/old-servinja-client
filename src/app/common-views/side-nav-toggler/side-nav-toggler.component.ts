import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { LayoutService } from '../../../services/common/layout.service';

@Component({
  selector: 'app-side-nav-toggler',
  templateUrl: './side-nav-toggler.component.html',
  styleUrls: ['./side-nav-toggler.component.scss']
})
export class SideNavTogglerComponent implements OnInit {
  // @Output()
  // sideNavToggeled = new EventEmitter();

  constructor(public layoutService: LayoutService) { }

  ngOnInit(): void {
    if (window.matchMedia('(max-width: 575px)').matches) {
      this.toggleSideNav();
    }
  }

  toggleSideNav(): void {
    this.layoutService.toggleSideNav();
    // this.sideNavToggeled.emit();
  }

}
