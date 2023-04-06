import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NavTitleService {
  navTitle$ = new Subject<string>();
}
