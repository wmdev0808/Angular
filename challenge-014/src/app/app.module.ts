import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ContactModule } from './contact/contact.module';
import { GreetingModule } from './greeting/greeting.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ContactModule,
    GreetingModule.forRoot({ userName: 'Miss Marple' }),
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
