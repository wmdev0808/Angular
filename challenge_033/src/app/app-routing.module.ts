import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GettingStartedComponent } from './getting-started/getting-started.component';
import { SchematicsComponent } from './schematics/schematics.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'getting-started',
    pathMatch: 'full',
  },
  { path: 'getting-started', component: GettingStartedComponent },
  { path: 'schematics', component: SchematicsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
