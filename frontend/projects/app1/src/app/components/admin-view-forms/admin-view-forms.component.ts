import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.services';
import { FileUploadServiceService } from '../../services/file-upload-service.service';
@Component({
  selector: 'app-admin-view-forms',
  templateUrl: './admin-view-forms.component.html',
  styleUrls: ['./admin-view-forms.component.css'],
})
export class AdminViewFormsComponent {
  forms: any = [];
  successMsg: string = '';
  formid: number = 0;
  filterVisible: boolean = false;
  selectedForm: any | null = null;
  selectedStartDate: string = '';
  selectedEndDate: string = '';
  currentPage:number=1;
  itemsPerPage:number=5;
  offset: number = 0;
  totalItems: number = 0;
  constructor(
    private adminService: AdminService,
    private fileService: FileUploadServiceService
  ) {}
  ngOnInit(): void {
    this.currentPage = 1;
    this.itemsPerPage = 5;
    this.loadForms();
  }

  loadForms() {
    const token = localStorage.getItem('token');
    if (token) {
      this.offset = ((this.currentPage - 1) * this.itemsPerPage);
      this.adminService.getForms(token, this.itemsPerPage, this.offset).subscribe({
        next: (response) => {
          if (Array.isArray(response.data)) {
            this.forms = [...response.data];
          }
          this.totalItems = response.totalItems;
        },
        error: (err) => {},
      });
    }
  }

  deleteForm(id: number) {
    this.formid = id;
    this.successMsg = 'Are you sure you wantt to delete?';
  }
  handleClose() {
    this.successMsg = '';
    this.loadForms();
  }
  handleOkClick() {
    const token = localStorage.getItem('token');
    if (token) {
      this.adminService.deleteFormById(token, this.formid).subscribe({
        next: (res) => {
          console.log(res);
        },
      });
    }
    this.successMsg = '';
  }
  onPageChange(page: number) {
    console.log(page);
    this.currentPage = page;
    this.loadForms();
  }
  onItemsPerPageChange() {
    this.currentPage = 1; 
    this.loadForms(); 
  }

  exportCsv(fid: number, ftitle: string) {
    this.selectedForm = { id: fid, title: ftitle };
    this.filterVisible = !this.filterVisible;
  }

  closeFilter() {
    this.filterVisible = false;
  }

  applyFilter(fid: number, ftitle: string) {
    const token = localStorage.getItem('token');
    let startDateParam: string | null = null;
    let endDateParam: string | null = null;

    if (this.selectedStartDate !== '' && this.selectedEndDate !== '') {
      const startDate = new Date(this.selectedStartDate);
      const endDate = new Date(this.selectedEndDate);
      if (startDate >= endDate) {
        alert('Start date must be less than the end date.');
        return;
      }
      startDateParam = this.selectedStartDate;
      endDateParam = this.selectedEndDate;
    }

    this.fileService
      .exportForm(fid, token, startDateParam, endDateParam)
      .subscribe(
        (response: any) => {
          if (typeof response === 'string') {
            const blob = new Blob([response], { type: 'text/csv' });
            const blobUrl = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `${ftitle}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(blobUrl);
          } else {
            console.error('Unexpected response format. Expected a CSV string.');
          }
        }, 
        (error) => {
          console.error(error);
        }
      );
    this.filterVisible = false;
    this.selectedStartDate = '';
    this.selectedEndDate = '';
  }
}
