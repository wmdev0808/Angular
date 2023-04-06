import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemsDetailComponent } from './items-detail.component';
import { ItemsListComponent } from './items-list.component';
import { ItemsComponent } from './items.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full' },
  { path: 'list', component: ItemsListComponent },
  { path: ':id', component: ItemsDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemsRoutingModule {}
