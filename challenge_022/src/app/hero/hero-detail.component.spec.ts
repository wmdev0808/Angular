import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { Router } from '@angular/router';

import {
  ActivatedRoute,
  ActivatedRouteStub,
  asyncData,
  click,
} from '../../testing';

import { Hero } from '../model/hero';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroDetailService } from './hero-detail.service';
import { HeroModule } from './hero.module';

////// Testing Vars //////
let activatedRoute: ActivatedRouteStub;
let component: HeroDetailComponent;
let fixture: ComponentFixture<HeroDetailComponent>;
let page: Page;

////// Tests //////
describe('HeroDetailComponent', () => {
  beforeEach(() => {
    activatedRoute = new ActivatedRouteStub();
  });
  describe('with HeroModule setup', heroModuleSetup);
  describe('when override its provided HeroDetailService', overrideSetup);
  describe('with FormsModule setup', formsModuleSetup);
  describe('with SharedModule setup', sharedModuleSetup);
});

///////////////////

function overrideSetup() {
  class HeroDetailServiceSpy {
    testHero: Hero = { id: 42, name: 'Test Hero' };

    /* emit cloned test hero */
    getHero = jasmine
      .createSpy('getHero')
      .and.callFake(() => asyncData(Object.assign({}, this.testHero)));

    /* emit clone of test hero, with changes merged in */
    saveHero = jasmine
      .createSpy('saveHero')
      .and.callFake((hero: Hero) =>
        asyncData(Object.assign(this.testHero, hero))
      );
  }

  // the `id` value is irrelevant because ignored by service stub
  beforeEach(() => activatedRoute.setParamMap({ id: 99999 }));

  beforeEach(async () => {
    const routerSpy = createRouterSpy();

    await TestBed.configureTestingModule({
      imports: [HeroModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: routerSpy },
        // HeroDetailService at this level is IRRELEVANT!
        { provide: HeroDetailService, useValue: {} },
      ],
    })

      // Override component's own provider
      .overrideComponent(HeroDetailComponent, {
        set: {
          providers: [
            { provide: HeroDetailService, useClass: HeroDetailServiceSpy },
          ],
        },
      })

      .compileComponents();
  });

  let hdsSpy: HeroDetailServiceSpy;

  beforeEach(async () => {
    await createComponent();
    // get the component's injected HeroDetailServiceSpy
    hdsSpy = fixture.debugElement.injector.get(HeroDetailService) as any;
  });

  it('should have called `getHero`', () => {
    expect(hdsSpy.getHero.calls.count())
      .withContext('getHero called once')
      .toBe(1);
  });

  it("should display stub hero's name", () => {
    expect(page.nameDisplay.textContent).toBe(hdsSpy.testHero.name);
  });

  it('should save stub hero change', fakeAsync(() => {
    const origName = hdsSpy.testHero.name;
    const newName = 'New Name';

    page.nameInput.value = newName;

    page.nameInput.dispatchEvent(new Event('input')); // tell Angular

    expect(component.hero.name)
      .withContext('component hero has new name')
      .toBe(newName);
    expect(hdsSpy.testHero.name)
      .withContext('service hero unchanged before save')
      .toBe(origName);

    click(page.saveBtn);
    expect(hdsSpy.saveHero.calls.count())
      .withContext('saveHero called once')
      .toBe(1);

    tick(); // wait for async save to complete
    expect(hdsSpy.testHero.name)
      .withContext('service hero has new name after save')
      .toBe(newName);
    expect(page.navigateSpy.calls.any())
      .withContext('router.navigate called')
      .toBe(true);
  }));

  it('fixture injected service is not the component injected service', inject(
    // inject gets the service from the fixture
    [HeroDetailService],
    (fixtureService: HeroDetailService) => {
      // use `fixture.debugElement.injector` to get service from component
      const componentService =
        fixture.debugElement.injector.get(HeroDetailService);

      expect(fixtureService)
        .withContext('service injected from fixture')
        .not.toBe(componentService);
    }
  ));
}

////////////////////
import {
  getTestHeroes,
  TestHeroService,
  HeroService,
} from '../model/testing/test-hero.service';

const firstHero = getTestHeroes()[0];

function heroModuleSetup() {
  beforeEach(async () => {
    const routerSpy = createRouterSpy();

    await TestBed.configureTestingModule({
      imports: [HeroModule],
      //  declarations: [ HeroDetailComponent ], // NO!  DOUBLE DECLARATION
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: HeroService, useClass: TestHeroService },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
  });

  describe('when navigate to existing hero', () => {
    let expectedHero: Hero;

    beforeEach(async () => {
      expectedHero = firstHero;
      activatedRoute.setParamMap({ id: expectedHero.id });
      await createComponent();
    });

    it("should display that hero's name", () => {
      expect(page.nameDisplay.textContent).toBe(expectedHero.name);
    });

    it('should navigate when click cancel', () => {
      click(page.cancelBtn);
      expect(page.navigateSpy.calls.any())
        .withContext('router.navigate called')
        .toBe(true);
    });

    it('should save when click save but not navigate immediately', () => {
      // Get service injected into component and spy on its`saveHero` method.
      // It delegates to fake `HeroService.updateHero` which delivers a safe test result.
      const hds = fixture.debugElement.injector.get(HeroDetailService);
      const saveSpy = spyOn(hds, 'saveHero').and.callThrough();

      click(page.saveBtn);
      expect(saveSpy.calls.any())
        .withContext('HeroDetailService.save called')
        .toBe(true);
      expect(page.navigateSpy.calls.any())
        .withContext('router.navigate not called')
        .toBe(false);
    });

    it('should navigate when click save and save resolves', fakeAsync(() => {
      click(page.saveBtn);
      tick(); // wait for async save to complete
      expect(page.navigateSpy.calls.any())
        .withContext('router.navigate called')
        .toBe(true);
    }));

    it('should convert hero name to Title Case', () => {
      // get the name's input and display elements from the DOM
      const hostElement: HTMLElement = fixture.nativeElement;
      const nameInput: HTMLInputElement = hostElement.querySelector('input')!;
      const nameDisplay: HTMLElement = hostElement.querySelector('span')!;

      // simulate user entering a new name into the input box
      nameInput.value = 'quick BROWN  fOx';

      // Dispatch a DOM event so that Angular learns of input value change.
      nameInput.dispatchEvent(new Event('input'));

      // Tell Angular to update the display binding through the title pipe
      fixture.detectChanges();

      expect(nameDisplay.textContent).toBe('Quick Brown  Fox');
    });
  });

  describe('when navigate with no hero id', () => {
    beforeEach(async () => {
      await createComponent();
    });

    it('should have hero.id === 0', () => {
      expect(component.hero.id).toBe(0);
    });

    it('should display empty hero name', () => {
      expect(page.nameDisplay.textContent).toBe('');
    });
  });

  describe('when navigate to non-existent hero id', () => {
    beforeEach(async () => {
      activatedRoute.setParamMap({ id: 99999 });
      await createComponent();
    });

    it('should try to navigate back to hero list', () => {
      expect(page.gotoListSpy.calls.any())
        .withContext('comp.gotoList called')
        .toBe(true);
      expect(page.navigateSpy.calls.any())
        .withContext('router.navigate called')
        .toBe(true);
    });
  });

  // Why we must use `fixture.debugElement.injector` in `Page()`
  it("cannot use `inject` to get component's provided HeroDetailService", () => {
    let service: HeroDetailService;
    fixture = TestBed.createComponent(HeroDetailComponent);
    expect(
      // Throws because `inject` only has access to TestBed's injector
      // which is an ancestor of the component's injector
      inject([HeroDetailService], (hds: HeroDetailService) => (service = hds))
    ).toThrowError(/No provider for HeroDetailService/);

    // get `HeroDetailService` with component's own injector
    service = fixture.debugElement.injector.get(HeroDetailService);
    expect(service).withContext('debugElement.injector').toBeDefined();
  });
}

/////////////////////
import { FormsModule } from '@angular/forms';
import { TitleCasePipe } from '../shared/title-case.pipe';

function formsModuleSetup() {
  beforeEach(async () => {
    const routerSpy = createRouterSpy();

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [HeroDetailComponent, TitleCasePipe],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: HeroService, useClass: TestHeroService },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
  });

  it("should display 1st hero's name", waitForAsync(() => {
    const expectedHero = firstHero;
    activatedRoute.setParamMap({ id: expectedHero.id });
    createComponent().then(() => {
      expect(page.nameDisplay.textContent).toBe(expectedHero.name);
    });
  }));
}

///////////////////////
import { SharedModule } from '../shared/shared.module';

function sharedModuleSetup() {
  beforeEach(async () => {
    const routerSpy = createRouterSpy();

    await TestBed.configureTestingModule({
      imports: [SharedModule],
      declarations: [HeroDetailComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: HeroService, useClass: TestHeroService },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();
  });

  it("should display 1st hero's name", waitForAsync(() => {
    const expectedHero = firstHero;
    activatedRoute.setParamMap({ id: expectedHero.id });
    createComponent().then(() => {
      expect(page.nameDisplay.textContent).toBe(expectedHero.name);
    });
  }));
}

/////////// Helpers /////

/** Create the HeroDetailComponent, initialize it, set test variables  */
function createComponent() {
  fixture = TestBed.createComponent(HeroDetailComponent);
  component = fixture.componentInstance;
  page = new Page(fixture);

  // 1st change detection triggers ngOnInit which gets a hero
  fixture.detectChanges();
  return fixture.whenStable().then(() => {
    // 2nd change detection displays the async-fetched hero
    fixture.detectChanges();
  });
}

class Page {
  // getter properties wait to query the DOM until called.
  get buttons() {
    return this.queryAll<HTMLButtonElement>('button');
  }
  get saveBtn() {
    return this.buttons[0];
  }
  get cancelBtn() {
    return this.buttons[1];
  }
  get nameDisplay() {
    return this.query<HTMLElement>('span');
  }
  get nameInput() {
    return this.query<HTMLInputElement>('input');
  }

  gotoListSpy: jasmine.Spy;
  navigateSpy: jasmine.Spy;

  constructor(someFixture: ComponentFixture<HeroDetailComponent>) {
    // get the navigate spy from the injected router spy object
    const routerSpy = someFixture.debugElement.injector.get(Router) as any;
    this.navigateSpy = routerSpy.navigate;

    // spy on component's `gotoList()` method
    const someComponent = someFixture.componentInstance;
    this.gotoListSpy = spyOn(someComponent, 'gotoList').and.callThrough();
  }

  //// query helpers ////
  private query<T>(selector: string): T {
    return fixture.nativeElement.querySelector(selector);
  }

  private queryAll<T>(selector: string): T[] {
    return fixture.nativeElement.querySelectorAll(selector);
  }
}

function createRouterSpy() {
  return jasmine.createSpyObj('Router', ['navigate']);
}
