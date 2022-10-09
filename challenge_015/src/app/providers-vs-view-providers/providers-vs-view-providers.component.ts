import { AnimalService } from './../animal.service';
import { FlowerService } from './../flower.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-providers-vs-view-providers',
  templateUrl: './providers-vs-view-providers.component.html',
  styleUrls: ['./providers-vs-view-providers.component.scss'],
  // viewProviders: [{ provide: AnimalService, useValue: { emoji: '🦔' } }],
})
export class ProvidersVsViewProvidersComponent {
  constructor(public flower: FlowerService, public animal: AnimalService) {}
}

// When using @Host() together with @SkipSelf() in
// child.component.ts for the AnimalService, add the
// following viewProviders array to the @Component metadata:

// viewProviders: [{ provide: AnimalService, useValue: { emoji: '🦔' } }]

// So, the entire @ChildComponent() decorator and its
// metadata should be as follows:

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: [ './app.component.css' ],
//   viewProviders: [{ provide: AnimalService, useValue: { emoji: '🦔' } }]
// })
