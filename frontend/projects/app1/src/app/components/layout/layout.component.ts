import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { VisibilityService } from 'src/app/services/visibility.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit{
    constructor(private router: Router, private visibility: VisibilityService) {}
    menuType: string ='';
    isLoggedIn:boolean = false;
    logout()
    {
      const token = localStorage.getItem('token');
      if(token){
        localStorage.removeItem('token');
        localStorage.setItem('visibility', 'false');
      }
      this.visibility.updateVisibility(true);
      this.router.navigateByUrl('');
    }

    ngOnInit(): void {
      this.router.events.subscribe({
        next:(val:any)=>{
         if(val.routerEvent)
        {
          if(localStorage.getItem('token'))
          {
            this.isLoggedIn = true;
            if(localStorage.getItem('token') && val.routerEvent.url.includes('user-home')){
              this.menuType = 'user';
            }
            else if(localStorage.getItem('token') && val.routerEvent.url.includes('admin-home')){
              this.menuType = 'admin';
            }
            else{
              this.menuType = 'admin'
            }
          }
          
        }
      }})
    }
    goBack()
    {
      localStorage.removeItem('token');
      this.visibility.updateVisibility(true);
      this.router.navigateByUrl('');
    }
}
