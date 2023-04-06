import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ServiceModule } from './service-and-module';

@NgModule({
  imports: [BrowserModule, RouterModule.forRoot([]), ServiceModule],
})
export class AppModule {}
