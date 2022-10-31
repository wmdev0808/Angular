import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HeroAppMainComponent } from './hero-app-main.component';
import { HeroAppComponent } from './hero-app.component';
import { HeroControlsComponent } from './hero-controls.component';
import { HeroDetailsComponent } from './hero-details.component';
import { HeroTeamComponent } from './hero-team.component';
import { QuestSummaryComponent } from './quest-summary.component';

@NgModule({
  declarations: [
    HeroAppComponent,
    HeroAppMainComponent,
    HeroControlsComponent,
    HeroDetailsComponent,
    HeroTeamComponent,
    QuestSummaryComponent,
  ],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [HeroAppComponent],
})
export class AppModule {}
