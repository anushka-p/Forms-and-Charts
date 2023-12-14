import { Component, OnInit } from '@angular/core';
// import { FileUploadServiceService } from '../../services/file-upload-service.service';
import { FileItem, FileUploader, ParsedResponseHeaders } from 'ng2-file-upload';

@Component({
  selector: 'app-rough',
  templateUrl: './rough.component.html',
  styleUrls: ['./rough.component.css']
})
export class RoughComponent {

  public uploader: FileUploader = new FileUploader({
    url: 'http://localhost:3000/drive/upload-file',
    itemAlias: 'file',
    autoUpload: true,
  });

  constructor() {
    this.uploader.onAfterAddingFile = (fileItem: FileItem) => {
      fileItem.withCredentials = false; 
    };

    this.uploader.onProgressItem = (fileItem: FileItem, progress: any) => {
      console.log(`Upload Progress: ${progress}%`);
    };

    this.uploader.onSuccessItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      console.log('File uploaded successfully', JSON.parse(response));
    };

    this.uploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) => {
      console.error('Error uploading file', JSON.parse(response));
    };
    this.uploader.onProgressAll = (progress: any) => {
      this.uploader.progress = progress;}
  }
 


}
