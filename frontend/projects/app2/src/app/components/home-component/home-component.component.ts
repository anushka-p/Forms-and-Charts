import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { VisibilityService } from 'src/app/services/visibility.service';

@Component({
  selector: 'app-home-component',
  templateUrl: './home-component.component.html',
  styleUrls: ['./home-component.component.css']
})
export class HomeComponentComponent {
  constructor(private router:Router, private visibility: VisibilityService){}
  isNavbarCollapsed = true;

  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }
  goBack()
    {
      localStorage.removeItem('token');
      this.router.navigateByUrl('');
      this.visibility.updateVisibility(true);
    }
}
