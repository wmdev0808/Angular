import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { PipeContainerComponent } from './pipe-container/pipe-container.component';
import { AssignmentContainerComponent } from './assignment-container/assignment-container.component';
import { FormsModule } from '@angular/forms';
import { ShortenPipe } from './shorten.pipe';
import { FilterPipe } from './filter.pipe';
import { ReversePipe } from './reverse.pipe';
import { SortPipe } from './sort.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PipeContainerComponent,
    AssignmentContainerComponent,
    ShortenPipe,
    FilterPipe,
    ReversePipe,
    SortPipe,
  ],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
