import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavTitleService } from '../nav-title.service';

@Component({
  selector: 'app-schematics',
  templateUrl: './schematics.component.html',
  styleUrls: ['./schematics.component.scss'],
})
export class SchematicsComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private navTitleService: NavTitleService
  ) {}

  ngOnInit(): void {
    this.route.data
      .pipe(map((data) => data['title']))
      .subscribe((title) => this.navTitleService.navTitle$.next(title));
  }
}
