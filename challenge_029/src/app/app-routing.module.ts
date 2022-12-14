import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CurrencyPipeComponent } from './currency-pipe/currency-pipe.component';
import { DatePipeComponent } from './date-pipe/date-pipe.component';
import { DecimalPipeComponent } from './decimal-pipe/decimal-pipe.component';

const routes: Routes = [
  { path: '', redirectTo: 'decimal-pipe', pathMatch: 'full' },
  { path: 'decimal-pipe', component: DecimalPipeComponent },
  { path: 'currency-pipe', component: CurrencyPipeComponent },
  { path: 'date-pipe', component: DatePipeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
