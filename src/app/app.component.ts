import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoaderService } from 'src/services/common/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  loadingText: string;
  constructor(private ngxService: NgxUiLoaderService, private loaderService: LoaderService) { }

  ngOnInit(): void {
    this.getLoaderRunningStatus();
  }

  getLoaderRunningStatus(): void {
    this.loaderService.isLoaderRunning.subscribe(value => {
      this.loadingText = this.loaderService.loadingText;
      if (value) {
        this.ngxService.start();
      } else {
        this.ngxService.stop();
      }
    });
  }

}
