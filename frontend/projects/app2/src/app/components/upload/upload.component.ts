import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest } from '@angular/common/http';
import { FilePond, registerPlugin } from 'filepond';  

import { Router } from '@angular/router';
import { SharedDataService } from '../../services/shared-data.service';
import { ManipulateFilesService } from '../../services/manipulate-files.service';


@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
  // @ViewChild('myPond') myPond: any; 
  availableCsvFiles:[] = [];
  constructor(private http: HttpClient, 
    private sharedDataService: SharedDataService, 
    private manipulatefiles:ManipulateFilesService,
    private route: Router) {}
  selectedCsvFile!: string;
  headings!:any;
  isDropvisible:boolean = false;
  isSelectvisible:boolean = false;
  isEditVisible:boolean = false;
  pondOptions = {
    allowMultiple: true,
    labelIdle: 'Drop files here or Select',
    acceptedFileTypes: ['text/csv'], 
    server: {
      process: this.onProcessFile.bind(this),
    },
  };

  onProcessFile(fieldName: string, file: any, metadata: any, load: any, error: any, progress: any, abort: any, transfer: any, options: any) {
    const formData = new FormData();
    formData.append('file', file);
    this.selectedCsvFile = file.name
    
    const uploadUrl = 'http://localhost:3000/test/upload';
    const uploadReq = new HttpRequest('POST', uploadUrl, formData, {
      reportProgress: true, 
    });
  
    return this.http.request(uploadReq).subscribe(
      (event: any) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (event.total) {
              const percentDone = Math.round((100 * event.loaded) / event.total);
              progress(true, percentDone, 100);
              setTimeout(()=>{
                this.route.navigateByUrl('app2/chart-generator')
              }, 2000)
            }
            break;
          case HttpEventType.Response:
             this.headings = event.body
            this.sharedDataService.setCsvHeadings(this.headings, this.selectedCsvFile);
            load(this.headings);
           
            break;
        }
      },
      (err) => {
        error('Error uploading file');
      }
    );
  }
  

  pondHandleInit() {
    // console.log('FilePond has initialised', this.myPond);
  }
  ngOnInit()
  {
    this.manipulatefiles.getAvailableFiles().subscribe({
      next:(res)=>{
        this.availableCsvFiles = res.files
      }
    })
  }
  add()
  {
    confirm(`you have selected ${this.selectedCsvFile}`);
    this.http.post('http://localhost:3000/test/upload', {filename:this.selectedCsvFile}).subscribe({
      next:(res:any)=>{
        this.headings = res;
        this.sharedDataService.setCsvHeadings(this.headings, this.selectedCsvFile);
        this.route.navigateByUrl('app2/chart-generator')
      }
    })
  }
  setDragandDrop()
  {
    this.isDropvisible = true;
    this.isSelectvisible = false;
  }
  setSelect()
  {
    this.isDropvisible = false;
    this.isSelectvisible = true;
  }
 editSelect()
 {
  console.log("delete");
  this.isEditVisible = true;
  this.isSelectvisible = false;
 }
}
