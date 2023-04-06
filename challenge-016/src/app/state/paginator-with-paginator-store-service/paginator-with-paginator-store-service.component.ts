import { Component } from '@angular/core';

@Component({
  selector: 'app-paginator-with-paginator-store-service',
  templateUrl: './paginator-with-paginator-store-service.component.html',
  styleUrls: ['./paginator-with-paginator-store-service.component.scss'],
})
export class PaginatorWithPaginatorStoreServiceComponent {
  log(obj: unknown) {
    console.log(obj);
  }
}
