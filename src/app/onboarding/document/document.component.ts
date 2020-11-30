import { Component, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { CommonService } from 'src/services/common/common.service';
import { StoreService } from 'src/services/common/store.service';
import { NotificationUtil } from 'src/utils/notification.util';
import { DocTypes } from 'src/utils/common.util';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss', '../onboarding.component.scss']
})
export class DocumentComponent implements OnInit {
  @ViewChild('fileDropRef', { static: false }) fileDropEl: ElementRef;
  files: any[] = [];
  submitBtnStatus = 0;
  processing = false;
  @Output() moveToNextStep = new EventEmitter();

  constructor(
    private storeService: StoreService,
    private commonService: CommonService,
    private notify: NotificationUtil
  ) { }

  ngOnInit(): void {
  }

  /**
   * on file drop handler
   */
  onFileDropped($event): void {
    this.prepareFilesList($event);
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files): void {
    this.prepareFilesList(files);
  }

  /**
   * Convert Files list to normal array list
   * @param files (Files List)
   */
  prepareFilesList(files: Array<any>): void {
    for (const item of files) {
      item.progress = 0;
      this.files.push(item);
    }
    this.fileDropEl.nativeElement.value = '';
    this.uploadFilesSimulator(0);
  }

  /**
   * Simulate the upload process
   */
  uploadFilesSimulator(index: number): void {
    setTimeout(() => {
      if (index >= this.files.length) {
        this.submitBtnStatus = 2;
        return;
      } else {
        this.submitBtnStatus = 1;
        const progressInterval = setInterval(() => {
          if (this.files[index].progress >= 100) {
            clearInterval(progressInterval);
            this.uploadFilesSimulator(index + 1);
          } else {
            if (this.files[index].progress + 7 > 100) {
              this.files[index].progress = 100;
            } else {
              this.files[index].progress += 7;
            }
          }
        }, 100);
      }
    }, 500);
  }

  /**
   * Delete file from files list
   * @param index (File index)
   */
  deleteFile(index: number): void {
    if (this.files[index].progress < 100) {
      return;
    }
    this.files.splice(index, 1);
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes, decimals = 2): any {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  submitDocument$(): any {
    this.processing = true;
    const data: FormData = new FormData();
    this.files.forEach(file => {
      data.append('files', file);
    });
    data.append('userId', this.storeService.getUserId());
    data.append('docType', DocTypes.identityProof);
    this.commonService.storeUserDocuments(data).subscribe(
      (response) => {
        if (response === 'success') {
          this.storeService.updateOnboardingStage(0);
          this.notify.showSuccess('Document saved successfully');
          this.moveToNextStep.emit(0);
        } else {
          this.notify.showError('Some error occured. Please try again');
        }
        this.processing = false;
      },
      (error) => {
        this.processing = false;
        this.notify.showError('Some error occured. Please try again');
      }
    );
  }

}
