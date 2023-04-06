import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { HeroListAutoCalcPageComponent } from './hero-list-auto-page/hero-list-auto-page.component';
import { HeroListAutoComponent } from './hero-list-auto/hero-list-auto.component';
import { HeroListEnterLeavePageComponent } from './hero-list-enter-leave-page/hero-list-enter-leave-page.component';
import { HeroListEnterLeaveComponent } from './hero-list-enter-leave/hero-list-enter-leave.component';
import { HeroListPageComponent } from './hero-list-page/hero-list-page.component';
import { InsertRemoveComponent } from './insert-remove/insert-remove.component';
import { OpenClosePageComponent } from './open-close-page/open-close-page.component';
import { OpenCloseComponent } from './open-close/open-close.component';
import { OpenCloseChildComponent } from './open-close-toggle/open-close-toggle.component';
import { QueryingComponent } from './querying/querying.component';
import { StatusSliderPageComponent } from './status-slider-page/status-slider-page.component';
import { StatusSliderComponent } from './status-slider/status-slider.component';
import { ToggleAnimationsPageComponent } from './toggle-animations-page/toggle-animations-page.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    HeroListAutoCalcPageComponent,
    HeroListAutoComponent,
    HeroListEnterLeavePageComponent,
    HeroListEnterLeaveComponent,
    HeroListPageComponent,
    HomeComponent,
    InsertRemoveComponent,
    OpenClosePageComponent,
    OpenCloseComponent,
    OpenCloseChildComponent,
    QueryingComponent,
    StatusSliderPageComponent,
    StatusSliderComponent,
    ToggleAnimationsPageComponent,
  ],
  imports: [BrowserModule, BrowserAnimationsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
