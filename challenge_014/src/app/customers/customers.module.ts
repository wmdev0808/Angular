import { NgModule } from '@angular/core';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { CustomersService } from './customers.service';
import { SharedModule } from '../shared/shared.module';
import { CustomersDetailComponent } from './customers-detail.component';
import { CustomersListComponent } from './customers-list.component';

@NgModule({
  declarations: [
    CustomersComponent,
    CustomersDetailComponent,
    CustomersListComponent,
  ],
  imports: [SharedModule, CustomersRoutingModule],
  providers: [CustomersService],
})
export class CustomersModule {}
