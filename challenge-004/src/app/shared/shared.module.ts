import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LoggingService } from '../logging.service';
import { AlertComponent } from './alert/alert.component';
import { DropdownDirective } from './dropdown.directive';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { PlaceholderDirective } from './placeholder.directive';

@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    DropdownDirective,
  ],
  imports: [CommonModule],
  exports: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    DropdownDirective,
    CommonModule,
  ],
  providers: [LoggingService],
  // entryComponents: [AlertComponent] // Since 9.0.0 with Ivy, the entryComponents property is no longer necessary.
})
export class SharedModule {}
