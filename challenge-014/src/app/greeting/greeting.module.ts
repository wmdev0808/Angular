import {
  ModuleWithProviders,
  NgModule,
  Optional,
  SkipSelf,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GreetingComponent } from './greeting.component';
import { UserServiceConfig } from './user.service';

@NgModule({
  declarations: [GreetingComponent],
  imports: [CommonModule],
  exports: [GreetingComponent],
})
export class GreetingModule {
  constructor(@Optional() @SkipSelf() parentModule?: GreetingModule) {
    if (parentModule) {
      throw new Error(
        'GreetingModule is already loaded. Import it in the AppModule only'
      );
    }
  }

  static forRoot(
    config: UserServiceConfig
  ): ModuleWithProviders<GreetingModule> {
    return {
      ngModule: GreetingModule,
      providers: [{ provide: UserServiceConfig, useValue: config }],
    };
  }
}
