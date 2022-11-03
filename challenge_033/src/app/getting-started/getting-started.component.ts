import { map } from 'rxjs/operators';
import {
  Component,
  AfterViewChecked,
  OnChanges,
  OnInit,
  DoCheck,
  AfterContentInit,
  AfterContentChecked,
  AfterViewInit,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavTitleService } from '../nav-title.service';

@Component({
  selector: 'app-getting-started',
  templateUrl: './getting-started.component.html',
  styleUrls: ['./getting-started.component.scss'],
})
export class GettingStartedComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private navTitleService: NavTitleService
  ) {}

  ngOnInit() {
    this.route.data.pipe(map((data) => data['title'])).subscribe((title) => {
      this.navTitleService.navTitle$.next(title);
    });
  }
}
