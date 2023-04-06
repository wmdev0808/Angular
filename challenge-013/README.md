# Dynamic component loader

- Component templates are not always fixed. An application might need to load new components at runtime.

## Dynamic component loading

- The following example shows how to build a dynamic ad banner.

  - The hero agency is planning an ad campaign with several different ads cycling through the banner. New ad components are added frequently by several different teams. This makes it impractical to use a template with a static component structure.

  - Instead, you need a way to load a new component without a fixed reference to the component in the ad banner's template.

- Angular comes with its own API for loading components dynamically.

## The anchor directive

- Before adding components, you have to define an anchor point to tell Angular where to insert components.

  - The ad banner uses a helper directive called AdDirective to mark valid insertion points in the template.

    - src/app/ad.directive.ts

      ```
      import { Directive, ViewContainerRef } from '@angular/core';

      @Directive({
        selector: '[adHost]',
      })
      export class AdDirective {
        constructor(public viewContainerRef: ViewContainerRef) { }
      }
      ```

    - `AdDirective` injects `ViewContainerRef` to gain access to the view container of the element that will host the dynamically added component.

## Loading components

- The `<ng-template>` element is where you apply the directive you just made. To apply the `AdDirective`, recall the selector from ad.directive.ts, `[adHost]`. Apply that to `<ng-template>` without the square brackets. Now Angular knows where to dynamically load components.

- src/app/ad-banner.component.ts (template)

  ```
  template: `
    <div class="ad-banner-example">
      <h3>Advertisements</h3>
      <ng-template adHost></ng-template>
    </div>
  `
  ```

  - The `<ng-template>` element is a good choice for dynamic components because it doesn't render any additional output.

## Resolving components

- src/app/ad-banner.component.ts (excerpt)

  ```
  export class AdBannerComponent implements OnInit, OnDestroy {
    @Input() ads: AdItem[] = [];

    currentAdIndex = -1;

    @ViewChild(AdDirective, {static: true}) adHost!: AdDirective;
    interval: number|undefined;

    ngOnInit(): void {
      this.loadComponent();
      this.getAds();
    }

    ngOnDestroy() {
      clearInterval(this.interval);
    }

    loadComponent() {
      this.currentAdIndex = (this.currentAdIndex + 1) % this.ads.length;
      const adItem = this.ads[this.currentAdIndex];

      const viewContainerRef = this.adHost.viewContainerRef;
      viewContainerRef.clear();

      const componentRef = viewContainerRef.createComponent<AdComponent>(adItem.component);
      componentRef.instance.data = adItem.data;
    }

    getAds() {
      this.interval = setInterval(() => {
        this.loadComponent();
      }, 3000);
    }
  }
  ```

  - To add the component to the template, you call `createComponent()` on `ViewContainerRef`.

  - The `createComponent()` method returns a reference to the loaded component. Use that reference to interact with the component by assigning to its properties or calling its methods.

## The AdComponent interface

- In the ad banner, all components implement a common `AdComponent` interface to standardize the API for passing data to the components.

  - ad.component.ts

    ```
    export interface AdComponent {
      data: any;
    }
    ```

  - hero-job-ad.component.ts

    ```
    import { Component, Input } from '@angular/core';

    import { AdComponent } from './ad.component';

    @Component({
      template: `
        <div class="job-ad">
          <h4>{{data.headline}}</h4>
          {{data.body}}
        </div>
      `
    })
    export class HeroJobAdComponent implements AdComponent {
      @Input() data: any;
    }
    ```

  - hero-profile.component.ts

    ```
    import { Component, Input } from '@angular/core';

    import { AdComponent } from './ad.component';

    @Component({
      template: `
        <div class="hero-profile">
          <h3>Featured Hero Profile</h3>
          <h4>{{data.name}}</h4>

          <p>{{data.bio}}</p>

          <strong>Hire this hero today!</strong>
        </div>
      `
    })
    export class HeroProfileComponent implements AdComponent {
      @Input() data: any;
    }
    ```
