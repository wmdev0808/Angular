import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PopupService } from './popup.service';
import { PopupComponent } from './popup.component';

@NgModule({
  declarations: [AppComponent, PopupComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule],
  providers: [PopupService],
  bootstrap: [AppComponent],
})
export class AppModule {}
