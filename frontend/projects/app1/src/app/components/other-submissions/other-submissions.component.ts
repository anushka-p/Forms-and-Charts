import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

import {jwtDecode} from 'jwt-decode';
import { AdminService } from '../../services/admin.services';

@Component({
  selector: 'app-other-submissions',
  templateUrl: './other-submissions.component.html',
  styleUrls: ['./other-submissions.component.css']
})
export class OtherSubmissionsComponent {
  formid: any;
  otherSubData:any =[]
  tableHeading:string ='';
  state:string = '';
  isVisible:boolean = false;
  constructor(
    private adminservice: AdminService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.paramMap.subscribe(param => {
      this.formid = param.get('id');
      this.state = param.get('state');
      this.loadSubmissions();
      this.isVisible = true;
    });
  }

  loadSubmissions() {
  const token = localStorage.getItem('token');
  const decoded:any = jwtDecode(token);
  const userid = decoded.user_id;

  if (token) {
    this.adminservice.getOtherSubmission(token, this.formid, userid).subscribe({
      next: res => {
        if(res.data.length === 0){
          this.tableHeading = 'No Other Submissions yet!';
        } else {
          this.tableHeading = 'Other Submissions';
          this.otherSubData = res.data;
          console.log(this.otherSubData, "dkfjsdf");
          
          const datePipe = new DatePipe('en-US'); // Create an instance of DatePipe
          this.otherSubData.forEach(submission => {
            submission.submittedat = datePipe.transform(submission.submittedat, 'short'); // Format date
          });
        }
      }
    });
  }
}


  closeComponent()
{
 this.isVisible = !this.isVisible;
 console.log(this.isVisible);
 
  
}
}


