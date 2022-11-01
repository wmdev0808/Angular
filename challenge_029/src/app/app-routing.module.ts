import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DecimalPipeComponent } from './decimal-pipe/decimal-pipe.component';

const routes: Routes = [
  { path: '', redirectTo: 'decimal-pipe', pathMatch: 'full' },
  { path: 'decimal-pipe', component: DecimalPipeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
