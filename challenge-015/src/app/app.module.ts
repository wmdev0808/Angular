import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ResolutionModifiersComponent } from './resolution-modifiers/resolution-modifiers.component';
import { HostComponent } from './host/host.component';
import { HostChildComponent } from './host-child/host-child.component';
import { HostParentComponent } from './host-parent/host-parent.component';
import { OptionalComponent } from './optional/optional.component';
import { SelfComponent } from './self/self.component';
import { SelfNoDataComponent } from './self-no-data/self-no-data.component';
import { SkipselfComponent } from './skipself/skipself.component';
import { ProvidersVsViewProvidersComponent } from './providers-vs-view-providers/providers-vs-view-providers.component';
import { ChildComponent } from './child/child.component';
import { InspectorComponent } from './inspector/inspector.component';
import { HierarchicalDependencyInjectionComponent } from './hierarchical-dependency-injection/hierarchical-dependency-injection.component';
import { VillainsListComponent } from './villains-list/villains-list.component';
import { HeroesListComponent } from './heroes-list/heroes-list.component';
import { HeroTaxReturnComponent } from './hero-tax-return/hero-tax-return.component';
import { carComponents } from './car/car.components';

@NgModule({
  declarations: [
    AppComponent,
    ResolutionModifiersComponent,
    HostComponent,
    HostChildComponent,
    HostParentComponent,
    OptionalComponent,
    SelfComponent,
    SelfNoDataComponent,
    SkipselfComponent,
    ProvidersVsViewProvidersComponent,
    ChildComponent,
    InspectorComponent,
    HierarchicalDependencyInjectionComponent,
    VillainsListComponent,
    HeroesListComponent,
    HeroTaxReturnComponent,
    carComponents,
  ],
  imports: [BrowserModule, FormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
