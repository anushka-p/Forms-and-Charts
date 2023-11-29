import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  constructor() { }

  public csvHeadingsSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public csvFileNameSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  setCsvHeadings(info: any, selectedFile:string): void {
    this.csvHeadingsSubject.next(info);
    this.csvFileNameSubject.next(selectedFile);
  }
}
