import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { NavTitleService } from '../nav-title.service';
import { ActivatedRoute, Params, UrlSegment } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  currentNavTitle$?: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver,
    private navTitleService: NavTitleService
  ) {}

  ngOnInit() {
    this.currentNavTitle$ = this.navTitleService.navTitle$;
  }
}
