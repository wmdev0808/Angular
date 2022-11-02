import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrencyPipeComponent } from './currency-pipe/currency-pipe.component';
import { DecimalPipeComponent } from './decimal-pipe/decimal-pipe.component';

const routes: Routes = [
  { path: '', redirectTo: 'decimal-pipe', pathMatch: 'full' },
  { path: 'decimal-pipe', component: DecimalPipeComponent },
  { path: 'currency-pipe', component: CurrencyPipeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
