import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavTogglerComponent } from '../common-views/side-nav-toggler/side-nav-toggler.component';
import { SideNavComponent } from '../common-views/side-nav/side-nav.component';
import { CommonLayoutComponent } from '../common-views/common-layout/common-layout.component';
import { PopupModule } from '@progress/kendo-angular-popup';
import { CustomerRoutingModule } from '../customer/customer-routing.module';

@NgModule({
    declarations: [SideNavTogglerComponent, SideNavComponent, CommonLayoutComponent],
    imports: [
        CommonModule,
        PopupModule,
        CustomerRoutingModule
    ],
    exports: [
        CommonLayoutComponent,
    ]
})
export class CommonViewsModule { }
