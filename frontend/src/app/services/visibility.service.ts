import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VisibilityService {
   isVisibleSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  updateVisibility(isVisible: boolean): void {
    localStorage.setItem('isVisible', JSON.stringify(isVisible));
    this.isVisibleSubject.next(isVisible);
  }
  getVisibility(): boolean {
    const storedValue = localStorage.getItem('isVisible');
    return storedValue ? JSON.parse(storedValue) : true;
  }
}
