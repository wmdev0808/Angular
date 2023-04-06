import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { ClickDirective, ClickDirective2 } from './click.directive';
import {
  BigHeroDetailComponent,
  HeroDetailComponent,
} from './hero-detail.component';
import { HeroFormComponent } from './hero-form.component';
import { heroSwitchComponents } from './hero-switch.components';
import { SizerComponent } from './sizer.component';
import { SvgComponent } from './svg.component';

@NgModule({
  declarations: [
    AppComponent,
    BigHeroDetailComponent,
    HeroDetailComponent,
    HeroFormComponent,
    heroSwitchComponents,
    ClickDirective,
    ClickDirective2,
    SizerComponent,
    SvgComponent,
  ],
  imports: [BrowserModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
