import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DecimalPipeComponent } from './decimal-pipe/decimal-pipe.component';
import { CurrencyPipeComponent } from './currency-pipe/currency-pipe.component';
import { DatePipeComponent } from './date-pipe/date-pipe.component';

@NgModule({
  declarations: [
    AppComponent,
    DecimalPipeComponent,
    CurrencyPipeComponent,
    DatePipeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
