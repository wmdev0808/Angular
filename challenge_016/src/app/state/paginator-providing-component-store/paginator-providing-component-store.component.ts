import { Component } from '@angular/core';

@Component({
  selector: 'app-paginator-providing-component-store',
  templateUrl: './paginator-providing-component-store.component.html',
  styleUrls: ['./paginator-providing-component-store.component.scss'],
})
export class PaginatorProvidingComponentStoreComponent {
  log(obj: unknown) {
    console.log(obj);
  }
}
