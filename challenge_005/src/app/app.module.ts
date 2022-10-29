import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { GameControlComponent } from './game-control/game-control.component';
import { EvenComponent } from './even/even.component';
import { OddComponent } from './odd/odd.component';
import { FormsModule } from '@angular/forms';
import { CockpitComponent } from './cockpit/cockpit.component';
import { ServerElementComponent } from './server-element/server-element.component';
import { AppRoutingModule } from './app-routing.module';
import { BasicComponent } from './basic/basic.component';
import { ContentProjectionComponent } from './content-projection/content-projection.component';
import {
  ZippyComponent,
  ZippyContentDirective,
  ZippyToggleDirective,
} from './content-projection/example-zippy/example-zippy.component';
import { ZippyBasicComponent } from './content-projection/zippy-basic/zippy-basic.component';
import { ZippyMultislotComponent } from './content-projection/zippy-multislot/zippy-multislot.component';
import { ZippyNgprojectasComponent } from './content-projection/zippy-ngprojectas/zippy-ngprojectas.component';

@NgModule({
  declarations: [
    AppComponent,
    GameControlComponent,
    EvenComponent,
    OddComponent,
    CockpitComponent,
    ServerElementComponent,
    BasicComponent,
    ContentProjectionComponent,
    ZippyComponent,
    ZippyBasicComponent,
    ZippyMultislotComponent,
    ZippyNgprojectasComponent,
    ZippyToggleDirective,
    ZippyContentDirective,
  ],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
