import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ItemsRoutingModule } from './items-routing.module';
import { ItemsComponent } from './items.component';
import { ItemService } from './items.service';
import { ItemsDetailComponent } from './items-detail.component';
import { ItemsListComponent } from './items-list.component';

@NgModule({
  declarations: [ItemsComponent, ItemsDetailComponent, ItemsListComponent],
  imports: [CommonModule, ItemsRoutingModule],
  providers: [ItemService],
})
export class ItemsModule {}
