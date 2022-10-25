import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SecurityComponent } from './security/security.component';
import { InnerHtmlBindingComponent } from './security/inner-html-binding/inner-html-binding.component';
import { BypassSecurityComponent } from './security/bypass-security/bypass-security.component';

@NgModule({
  declarations: [
    AppComponent,
    SecurityComponent,
    InnerHtmlBindingComponent,
    BypassSecurityComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
