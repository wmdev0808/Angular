import { NgModule } from '@angular/core';
import { RouterModule, Routes, Data } from '@angular/router';
import { GettingStartedComponent } from './getting-started/getting-started.component';
import { SchematicsComponent } from './schematics/schematics.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'getting-started',
    pathMatch: 'full',
  },
  {
    path: 'getting-started',
    component: GettingStartedComponent,
    data: { title: 'Getting Started' },
  },
  {
    path: 'schematics',
    component: SchematicsComponent,
    data: { title: 'Schematics' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
