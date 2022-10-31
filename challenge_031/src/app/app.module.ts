import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { APP_CONFIG, HERO_DI_CONFIG } from './app.config';
import { CarComponent } from './car/car.component';
import { HeroListComponent } from './heroes/hero-list.component';
import { HeroesTspComponent } from './heroes/heroes-tsp.component';
import { HeroesComponent } from './heroes/heroes.component';
import { InjectorComponent } from './injector.component';
import { Logger } from './logger.service';
import { ProvidersModule } from './providers.module';
import { TestComponent } from './test.component';
import { UserService } from './user.service';

@NgModule({
  declarations: [
    AppComponent,
    CarComponent,
    HeroesComponent,
    HeroesTspComponent,
    HeroListComponent,
    InjectorComponent,
    TestComponent,
  ],
  imports: [BrowserModule, ProvidersModule],
  exports: [CarComponent, HeroesComponent],
  providers: [
    Logger,
    UserService,
    { provide: APP_CONFIG, useValue: HERO_DI_CONFIG },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
