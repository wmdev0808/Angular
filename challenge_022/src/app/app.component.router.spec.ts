import { RouterTestingModule } from '@angular/router/testing';
import { Location } from '@angular/common';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { SpyLocation } from '@angular/common/testing';

import { AppComponent } from './app.component';
import { Router, RouterLinkWithHref } from '@angular/router';
import { TwainService } from './twain/twain.service';
import { asyncData, click } from 'src/testing';
import { DebugElement, Type } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AppModule } from './app.module';
import { routes } from './app-routing.module';
import {
  HeroService,
  TestHeroService,
} from './model/testing/test-hero.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AboutComponent } from './about/about.component';

let comp: AppComponent;
let fixture: ComponentFixture<AppComponent>;
let page: Page;
let router: Router;
let location: SpyLocation;

describe('AppComponent & RouterTestingModule', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule.withRoutes(routes)],
      providers: [{ provide: HeroService, useClass: TestHeroService }],
    }).compileComponents();
  }));

  it('should navigate to "Dashboard" immediately', fakeAsync(() => {
    createComponent();
    tick(); // wait for async data to arrive
    expectPathToBe('/dashboard', 'after initialNavigation()');
    expectElementOf(DashboardComponent);
  }));

  it('should navigate to "About" on click', fakeAsync(() => {
    createComponent();
    click(page.aboutLinkDe);
    // page.aboutLinkDe.nativeElement.click(); // ok but fails in phantom
    advance();
    expectPathToBe('/about');
    expectElementOf(AboutComponent);
  }));

  it('should navigate to "About" w/ browser location URL change', fakeAsync(() => {
    createComponent();
    location.simulateHashChange('/about');
    // location.go('/about'); // also works ... except, perhaps, in Stackblitz
    advance();
    expectPathToBe('/about');
    expectElementOf(AboutComponent);
  }));

  // Can't navigate to lazy loaded modules with this technique
  xit('should navigate to "Heroes" on click (not working yet', fakeAsync(() => {
    createComponent();
    page.heroesLinkDe.nativeElement.click();
    advance();
    expectPathToBe('/heroes');
  }));
});

//////////////
import { HeroModule } from './hero/hero.module'; // should be lazy loaded
import { HeroListComponent } from './hero/hero-list.component';

/////////// Can't get lazy loaded Heroes to work yet
xdescribe('AppComponent & Lazy Loading (not working yet)', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, RouterTestingModule.withRoutes(routes)],
    }).compileComponents();
  }));

  beforeEach(fakeAsync(() => {
    createComponent();
    router.resetConfig([{ path: 'heroes', loadChildren: () => HeroModule }]);
  }));

  it('should navigate to "Heroes" on click', waitForAsync(() => {
    page.heroesLinkDe.nativeElement.click();
    advance();
    expectPathToBe('/heroes');
    expectElementOf(HeroListComponent);
  }));

  it('can navigate to "Heroes" w/ browser location URL change', fakeAsync(() => {
    location.go('/heroes');
    advance();
    expectPathToBe('/heroes');
    expectElementOf(HeroListComponent);
  }));
});

////// Helpers ///////

/**
 * Advance to the routed page
 * Wait a tick, then detect changes, and tick again
 */
function advance(): void {
  tick(); // wait while navigating
  fixture.detectChanges(); // update view
  tick(); // wait for async data to arrive
}

function createComponent() {
  fixture = TestBed.createComponent(AppComponent);
  comp = fixture.componentInstance;

  const injector = fixture.debugElement.injector;
  location = injector.get(Location) as SpyLocation;
  router = injector.get(Router);
  router.initialNavigation();
  spyOn(injector.get(TwainService), 'getQuote')
    // fake fast async observable
    .and.returnValue(asyncData('Test Quote'));
  advance();

  page = new Page();
}

class Page {
  aboutLinkDe: DebugElement;
  dashboardLinkDe: DebugElement;
  heroesLinkDe: DebugElement;

  // for debugging
  comp: AppComponent;
  router: Router;
  fixture: ComponentFixture<AppComponent>;

  constructor() {
    const links = fixture.debugElement.queryAll(
      By.directive(RouterLinkWithHref)
    );

    this.aboutLinkDe = links[2];
    this.dashboardLinkDe = links[0];
    this.heroesLinkDe = links[1];

    // for debugging
    this.comp = comp;
    this.fixture = fixture;
    this.router = router;
  }
}

function expectPathToBe(path: string, expectationFailOutput?: any) {
  expect(location.path())
    .withContext(expectationFailOutput || 'location.path()')
    .toEqual(path);
}

function expectElementOf(type: Type<any>): any {
  const el = fixture.debugElement.query(By.directive(type));
  expect(el).withContext(`expected an element for ${type.name}`).toBeTruthy();

  return el;
}
