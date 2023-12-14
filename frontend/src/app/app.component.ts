import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { VisibilityService } from './services/visibility.service';
import { Subject, filter, takeUntil } from 'rxjs';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private ngUnsubscribe = new Subject();

  constructor (private router: Router , private visibility: VisibilityService) {}
  title = 'multiple-app';
  isvisible:boolean = true;
  one(){
    this.isvisible = !this.isvisible
    this.visibility.updateVisibility(false);
    this.router.navigateByUrl('app1/home/login');
  }
  two()
  {
    this.isvisible = !this.isvisible
    this.visibility.updateVisibility(false);
    this.router.navigateByUrl('app2');
  }
  updateParentProperty(newValue: boolean): void {
    this.isvisible = newValue;
  }
  ngOnInit() {
    this.isvisible = this.visibility.getVisibility();
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      takeUntil(this.ngUnsubscribe)
    )
    .subscribe(() => {
      this.isvisible = this.visibility.getVisibility();
    });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next('');
    this.ngUnsubscribe.complete();
  }
}
