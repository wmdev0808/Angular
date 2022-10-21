import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { CanvasComponent } from './canvas.component';

describe('CanvasComponent', () => {
  beforeEach(() => {
    (window as any).__zone_symbol__FakeAsyncTestMacroTask = [
      {
        source: 'HTMLCanvasElement.toBlob',
        callbackArgs: [{ size: 200 }],
      },
    ];
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CanvasComponent],
    }).compileComponents();
  });

  it('should be able to generate blob data from canvas', fakeAsync(() => {
    const fixture = TestBed.createComponent(CanvasComponent);
    const canvasComp = fixture.componentInstance;

    fixture.detectChanges();
    expect(canvasComp.blobSize).toBe(0);

    tick();
    expect(canvasComp.blobSize).toBeGreaterThan(0);
  }));
});
