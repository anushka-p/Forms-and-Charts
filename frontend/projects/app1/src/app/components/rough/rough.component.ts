import { Component, OnInit } from '@angular/core';
import { FileUploadServiceService } from '../../services/file-upload-service.service';
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';

@Component({
  selector: 'app-rough',
  templateUrl: './rough.component.html',
  styleUrls: ['./rough.component.css']
})
export class RoughComponent {

  public uploader: FileUploader = new FileUploader({
    url: 'http://localhost:3000/drive/upload-file', // Replace with your server URL
    itemAlias: 'file',
    autoUpload: true,
  });

  constructor() {
    this.uploader.onAfterAddingFile = (fileItem: FileItem) => {
      fileItem.withCredentials = false; // You might need to adjust this based on your server setup
    };

    this.uploader.onProgressItem = (fileItem: FileItem, progress: any) => {
      console.log(`Upload Progress: ${progress}%`);
      // Update your progress bar here
    };

    this.uploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      console.log('File uploaded successfully', JSON.parse(response));
      // Handle successful upload
    };

    this.uploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      console.error('Error uploading file', JSON.parse(response));
      // Handle upload error
    };
    this.uploader.onProgressAll = (progress: any) => {
      this.uploader.progress = progress;}
  }
  formSettings = {
    theme: 'mobiscroll'
};

minDate = "2022-01-01";
maxDate = "2023-12-31";
date1 = new Date();
currentYear = this.date1.getUTCFullYear();
currentMonth = this.date1.getUTCMonth() +1;
currentDaty = this.date1.getUTCDate();
}
