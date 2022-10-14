import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from '../book-list/book.model';

@Component({
  selector: 'app-book-collection',
  templateUrl: './book-collection.component.html',
  styleUrls: ['./book-collection.component.scss'],
})
export class BookCollectionComponent {
  @Input() books: ReadonlyArray<Book> | null = [];
  @Output() remove = new EventEmitter<string>();
}
