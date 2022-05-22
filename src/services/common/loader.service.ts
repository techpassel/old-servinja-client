import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class LoaderService {
    loadingText: string;
    isLoaderRunning: Subject<boolean> = new Subject<boolean>();

    startLoader(loadingText = null): any {
        this.loadingText = !loadingText || loadingText === '' ? 'Processing.Please wait...' : loadingText;
        this.isLoaderRunning.next(true);
    }

    stopLoader(): any {
        this.isLoaderRunning.next(false);
        this.loadingText = null;
    }
}
