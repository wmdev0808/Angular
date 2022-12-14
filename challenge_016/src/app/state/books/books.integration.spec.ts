import { BookCollectionComponent } from './book-collection/book-collection.component';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BookListComponent } from './book-list/book-list.component';
import { BooksComponent } from './books.component';
import { StoreModule } from '@ngrx/store';
import { booksReducer } from './state/books.reducer';
import { collectionReducer } from './state/collection.reducer';
import { GoogleBooksService } from './book-list/books.service';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('BooksComponent Integration Test', () => {
  let component: BooksComponent;
  let fixture: ComponentFixture<BooksComponent>;
  let httpMock: HttpTestingController;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        BooksComponent,
        BookListComponent,
        BookCollectionComponent,
      ],
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({
          books: booksReducer,
          collection: collectionReducer,
        }),
      ],
      providers: [GoogleBooksService],
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(BooksComponent);
    component = fixture.debugElement.componentInstance;

    fixture.detectChanges();

    const req = httpMock.expectOne(
      'https://www.googleapis.com/books/v1/volumes?maxResults=5&orderBy=relevance&q=oliver%20sacks'
    );
    req.flush({
      items: [
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
      ],
    });

    fixture.detectChanges();
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should create teh component', () => {
    expect(component).toBeTruthy();
  });

  describe('buttons should work as expected', () => {
    it('should add to collection when add button is clicked and remove from collection when remove button is clicked', () => {
      const addButton = getBookList()[1].query(
        By.css('[data-test=add-button]')
      );

      click(addButton);

      expect(getBookTitle(getCollection()[0])).toBe('Second Title');

      const removeButton = getCollection()[0].query(
        By.css('[data-test=remove-button]')
      );

      click(removeButton);

      expect(getCollection().length).toBe(0);
    });
  });

  function getCollection() {
    return fixture.debugElement.queryAll(By.css('.book-collection .book-item'));
  }

  function getBookList() {
    return fixture.debugElement.queryAll(By.css('.book-list .book-item'));
  }

  function getBookTitle(element: DebugElement) {
    return element.query(By.css('p')).nativeElement.textContent;
  }

  function click(element: DebugElement) {
    const el: HTMLElement = element.nativeElement;
    el.click();
    fixture.detectChanges();
  }
});
