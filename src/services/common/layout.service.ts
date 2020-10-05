import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class LayoutService {
    hideSideNav = new BehaviorSubject(false);

    constructor() { }

    toggleSideNav(): void {
        this.hideSideNav.next(!this.hideSideNav.value);
    }

}
