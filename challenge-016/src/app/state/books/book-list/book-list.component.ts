import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Book } from './book.model';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent {
  @Input() books: ReadonlyArray<Book> | null = [];
  @Output() add = new EventEmitter<string>();
}
