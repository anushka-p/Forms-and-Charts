import { Component, OnInit } from '@angular/core';
import {jwtDecode} from 'jwt-decode';
import { AdminService } from '../../services/admin.services';

@Component({
  selector: 'app-to-submit-forms',
  templateUrl: './to-submit-forms.component.html',
  styleUrls: ['./to-submit-forms.component.css'],
})
export class ToSubmitFormsComponent implements OnInit {
  forms: any = [];
  currentPage:number=1;
  itemsPerPage:number=5;
  offset: number = 0;
  totalItems: number = 0;
  formValidityMap: Map<number, boolean> = new Map(); // Store form validity

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
   this.loadforms();
  }
  onPageChange(page: number) {
    console.log(page);
    this.currentPage = page;
    this.loadforms();
  }
  onItemsPerPageChange() {
    this.currentPage = 1; 
    this.loadforms(); 
  }
  loadforms()
  {
    const token = localStorage.getItem('token');
    this.offset = ((this.currentPage - 1) * this.itemsPerPage);
    if (token) {
      this.adminService.getForms(token, null , null).subscribe({
        next: (response) => {
          if (Array.isArray(response.data)) {
            this.forms = [...response.data];
            const decoded: any = jwtDecode(token);
            const userId = decoded.user_id;

            this.forms.forEach((form: any) => {
              const formId = form.id;
              this.adminService
                .getUserValidity(token, userId, formId)
                .subscribe({
                  next: (res) => {
                    this.formValidityMap.set(formId, res.allowedToSubmit);
                  },
                  error: (err) => {
                    console.error(
                      `Error fetching validity for form ID ${formId}:`,
                      err
                    );
                  },
                });
            });
          }
        },
        error: (err) => {
          console.error('Error fetching forms:', err);
        },
      });
    }
  }
}
