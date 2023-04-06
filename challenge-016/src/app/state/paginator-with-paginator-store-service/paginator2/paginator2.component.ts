import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { PaginatorStore } from '../paginator.store';

@Component({
  selector: 'paginator2',
  templateUrl: 'paginator2.component.html',
  host: {
    class: 'mat-paginator',
  },
  styleUrls: ['./paginator2.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PaginatorStore],
})
export class Paginator2Component {
  @Input() set pageIndex(value: string | number) {
    this.paginatorStore.setPageIndex(value);
  }

  @Input() set length(value: string | number) {
    this.paginatorStore.setLength(value);
  }

  @Input() set pageSize(value: string | number) {
    this.paginatorStore.setPageSize(value);
  }

  @Input() set pageSizeOptions(value: readonly number[]) {
    this.paginatorStore.setPageSizeOptions(value);
  }

  // Outputing the event directly from the page$ Observable<PageEvent> property.
  /** Event emitted when the paginator changes the page size or page index. */
  @Output() readonly page = this.paginatorStore.page$;

  // ViewModel for the PaginatorComponent
  readonly vm$ = this.paginatorStore.vm$;

  constructor(private readonly paginatorStore: PaginatorStore) {}

  changePageSize(newPageSize: number) {
    this.paginatorStore.changePageSize(newPageSize);
  }
  nextPage() {
    this.paginatorStore.nextPage();
  }
  firstPage() {
    this.paginatorStore.firstPage();
  }
  previousPage() {
    this.paginatorStore.previousPage();
  }
  lastPage() {
    this.paginatorStore.lastPage();
  }
}
