import { Component, OnInit } from '@angular/core';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AdminService } from '../../services/admin.services';
@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
})
export class AdminHomeComponent implements OnInit {
  users: any[] = [];
  p: any;
  sortColumn: string = '';
  sortDirection: string = '';
  sortParam: string = '';
  currentPage: number = 1;
  totalItems: number = 0;
  itemsPerPage: number = 5;
  offset: number = 0;
  username: string = '';
  private searchSubject = new Subject<string>();
  constructor(private adminService: AdminService, private route: Router) {}
  ngOnInit() {
    this.currentPage = 1;
    this.itemsPerPage = 5;
    this.searchSubject
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe(() => {
        this.fetchData();
      });
    this.fetchData();
  }

  fetchData() {
    const token = localStorage.getItem('token');
    if (token) {
      if (this.sortColumn === '' && this.sortDirection === '') {
        this.sortParam = undefined;
      } else {
        this.sortParam = `${this.sortColumn}:${this.sortDirection}`;
      }
      if (this.username === '') {
        this.username = undefined;
      }
      this.offset = (this.currentPage - 1) * this.itemsPerPage;
      this.adminService
        .getAllAdminData(
          token,
          this.itemsPerPage,
          this.offset,
          this.sortParam,
          this.username
        )
        .pipe(
          catchError((error) => {
            console.error('Error fetching admin data:', error);
            return throwError(() => new Error('test'));
          })
        )
        .subscribe((response: any) => {
          if (Array.isArray(response.data)) {
            this.users = response.data;
            this.totalItems = response.totalItems;
            this.filteredUsers = [...this.users];
          } else {
            console.error('invalid response from api');
          }
        });
    }
  }

  filteredUsers: any = [];
  applyFilter(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const filterValue = inputElement ? inputElement.value : '';
    this.username = filterValue;
    this.searchSubject.next(filterValue);
  }
  deleteUser(id: any) {
    const confirmDelete = confirm('Are you sure you want to delete this user?');
    if (!confirmDelete) return;
    const token = localStorage.getItem('token');
    if (token) {
      this.adminService.deleteUserById(id, token).subscribe({
        next: (response) => {
          console.log(response);
          this.users = this.users.filter((user) => user.id !== id);
          this.filteredUsers = [...this.users];
          this.fetchData();
        },
      });
    }
  }

  onSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.fetchData();
  }

  onPageChange(page: number) {
    this.currentPage = page;
    console.log(this.currentPage);

    this.fetchData();
  }
  onItemsPerPageChange() {
    this.currentPage = 1;
    this.fetchData();
  }

  clearSearchField() {
    this.username = '';
    this.fetchData();
  }
}
