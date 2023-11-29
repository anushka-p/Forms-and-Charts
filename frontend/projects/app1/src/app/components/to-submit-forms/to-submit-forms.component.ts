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
  formValidityMap: Map<number, boolean> = new Map(); // Store form validity

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.adminService.getForms(token).subscribe({
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
