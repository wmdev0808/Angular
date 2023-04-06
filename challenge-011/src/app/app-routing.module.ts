import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignmentContainerComponent } from './assignment-container/assignment-container.component';
import { PipeContainerComponent } from './pipe-container/pipe-container.component';

const routes: Routes = [
  { path: '', component: PipeContainerComponent, pathMatch: 'full' },
  { path: 'assignment', component: AssignmentContainerComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
