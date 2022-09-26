import {
  AfterContentChecked,
  AfterContentInit,
  AfterViewChecked,
  AfterViewInit,
  Component,
  ContentChild,
  DoCheck,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-server-element',
  templateUrl: './server-element.component.html',
  styleUrls: ['./server-element.component.scss'],
  encapsulation: ViewEncapsulation.Emulated, // None, ShadowDom
})
export class ServerElementComponent
  implements
    AfterContentInit,
    AfterContentChecked,
    AfterViewInit,
    AfterViewChecked,
    DoCheck,
    OnChanges,
    OnDestroy,
    OnInit
{
  @Input('srvElement') element!: {
    type: string;
    name: string;
    content: string;
  };
  @Input() name!: string;
  @ViewChild('heading', { static: true })
  header!: ElementRef<HTMLDivElement>;
  @ContentChild('contentParagraph', { static: true }) paragraph?: ElementRef;

  constructor() {
    console.log('constructor called!');
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('ngChanges called!');
    console.log(changes);
  }

  ngOnInit() {
    console.log('ngOnInit called!');
    console.log('Text Content: ' + this.header!.nativeElement.textContent);
    console.log(
      'Text Content of paragraph: ' + this.paragraph!.nativeElement.textContent
    );
  }

  ngDoCheck() {
    console.log('ngDoCheck called!');
  }

  ngAfterContentInit() {
    console.log('ngAfterContentInit called!');
    console.log(
      'Text Content of paragraph: ' + this.paragraph!.nativeElement.textContent
    );
  }

  ngAfterContentChecked() {
    console.log('ngAfterContentChecked called!');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit called!');
    console.log('Text Content: ' + this.header.nativeElement.textContent);
  }

  ngAfterViewChecked() {
    console.log('ngAfterViewChecked called!');
  }

  ngOnDestroy() {
    console.log('ngOnDestroy called!');
  }
}
