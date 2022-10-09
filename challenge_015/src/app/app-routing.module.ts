import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HierarchicalDependencyInjectionComponent } from './hierarchical-dependency-injection/hierarchical-dependency-injection.component';
import { ProvidersVsViewProvidersComponent } from './providers-vs-view-providers/providers-vs-view-providers.component';
import { ResolutionModifiersComponent } from './resolution-modifiers/resolution-modifiers.component';

const routes: Routes = [
  { path: '', redirectTo: 'resolution-modifiers', pathMatch: 'full' },
  { path: 'resolution-modifiers', component: ResolutionModifiersComponent },
  {
    path: 'providers-vs-view-providers',
    component: ProvidersVsViewProvidersComponent,
  },
  {
    path: 'hierarchical-dependency-injection',
    component: HierarchicalDependencyInjectionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
