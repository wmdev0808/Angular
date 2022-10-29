import {
  Component,
  ContentChild,
  Directive,
  HostBinding,
  HostListener,
  Input,
  TemplateRef,
} from '@angular/core';

@Directive({
  selector: 'button[appExampleZippyToggle]',
})
export class ZippyToggleDirective {
  @HostBinding('attr.aria-expanded') ariaExpanded = this.zippy.expanded;
  @HostBinding('attr.aria-controls') ariaControls = this.zippy.contentId;
  @HostListener('click') toggleZippy() {
    this.zippy.expanded = !this.zippy.expanded;
  }

  constructor(public zippy: ZippyComponent) {}
}

let nextId = 0;

@Directive({
  selector: '[appExampleZippyContent]',
})
export class ZippyContentDirective {
  constructor(public templateRef: TemplateRef<unknown>) {}
}

@Component({
  selector: 'app-example-zippy',
  templateUrl: './example-zippy.component.html',
})
export class ZippyComponent {
  contentId = `zippy-${nextId++}`;
  @Input() expanded = false;
  @ContentChild(ZippyContentDirective) content!: ZippyContentDirective;
}
