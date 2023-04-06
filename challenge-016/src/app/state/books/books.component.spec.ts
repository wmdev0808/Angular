import { selectBookCollection, selectBooks } from './state/books.selectors';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { BooksComponent } from './books.component';
import { AppState } from './state/app.state';
import { BookListComponent } from './book-list/book-list.component';
import { BookCollectionComponent } from './book-collection/book-collection.component';
import { addBook, removeBook } from './state/books.actions';
import { By } from '@angular/platform-browser';
import { MemoizedSelector, DefaultProjectorFn } from '@ngrx/store';
import { Book } from './book-list/book.model';

describe('BooksComponent', () => {
  let fixture: ComponentFixture<BooksComponent>;
  let component: BooksComponent;
  let store: MockStore<AppState>;
  let mockBooksSelector: MemoizedSelector<
    any,
    readonly Book[],
    DefaultProjectorFn<readonly Book[]>
  >;
  let mockBookCollectionSelector: MemoizedSelector<
    any,
    Book[],
    DefaultProjectorFn<Book[]>
  >;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore()],
      imports: [HttpClientTestingModule],
      declarations: [
        BookListComponent,
        BookCollectionComponent,
        BooksComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(BooksComponent);
    component = fixture.componentInstance;

    mockBooksSelector = store.overrideSelector(selectBooks, [
      {
        id: 'firstId',
        volumeInfo: {
          title: 'First Title',
          authors: ['First Author'],
        },
      },
      {
        id: 'secondId',
        volumeInfo: {
          title: 'Second Title',
          authors: ['Second Author'],
        },
      },
      {
        id: 'thirdId',
        volumeInfo: {
          title: 'Third Title',
          authors: ['Third Author'],
        },
      },
      {
        id: 'fourthId',
        volumeInfo: {
          title: 'Fourth Title',
          authors: ['Fourth Author'],
        },
      },
    ]);

    mockBookCollectionSelector = store.overrideSelector(selectBookCollection, [
      {
        id: 'thirdId',
        volumeInfo: {
          title: 'Third Title',
          authors: ['Third Author'],
        },
      },
    ]);

    fixture.detectChanges();
    spyOn(store, 'dispatch').and.callFake(() => {});
  });

  afterEach(() => {
    TestBed.inject(MockStore)?.resetSelectors();
  });

  it('add method should dispatch add action', () => {
    component.onAdd('firstId');
    expect(store.dispatch).toHaveBeenCalledWith(addBook({ bookId: 'firstId' }));
  });

  it('remove method should dispatch remove action', () => {
    component.onRemove('thirdId');
    expect(store.dispatch).toHaveBeenCalledWith(
      removeBook({ bookId: 'thirdId' })
    );
  });

  it('should render a book list and a book collection', () => {
    expect(
      fixture.debugElement.queryAll(By.css('.book-list .book-item')).length
    ).toBe(4);
    expect(
      fixture.debugElement.queryAll(By.css('.book-collection .book-item'))
        .length
    ).toBe(1);
  });

  it('should update the UI when the store changes', () => {
    mockBooksSelector.setResult([
      {
        id: 'firstId',
        volumeInfo: {
          title: 'First Title',
          authors: ['First Author'],
        },
      },
      {
        id: 'secondId',
        volumeInfo: {
          title: 'Second Title',
          authors: ['Second Author'],
        },
      },
      {
        id: 'thirdId',
        volumeInfo: {
          title: 'Third Title',
          authors: ['Third Author'],
        },
      },
    ]);

    mockBookCollectionSelector.setResult([
      {
        id: 'firstId',
        volumeInfo: {
          title: 'First Title',
          authors: ['First Author'],
        },
      },
      {
        id: 'secondId',
        volumeInfo: {
          title: 'Second Title',
          authors: ['Second Author'],
        },
      },
    ]);

    store.refreshState();
    fixture.detectChanges();

    expect(
      fixture.debugElement.queryAll(By.css('.book-list .book-item')).length
    ).toBe(3);

    expect(
      fixture.debugElement.queryAll(By.css('.book-collection .book-item'))
        .length
    ).toBe(2);
  });
});
