# Templates

## SVG as templates

- You can use SVG files as templates in your Angular applications. When you use an SVG as the template, you are able to use directives and bindings just like with HTML templates. Use these features to dynamically generate interactive graphics.

### SVG syntax example

- The following example shows the syntax for using an SVG as a template.

  - src/app/svg.component.ts

    ```
    import { Component } from '@angular/core';

    @Component({
      selector: 'app-svg',
      templateUrl: './svg.component.svg',
      styleUrls: ['./svg.component.css']
    })
    export class SvgComponent {
      fillColor = 'rgb(255, 0, 0)';

      changeColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        this.fillColor = `rgb(${r}, ${g}, ${b})`;
      }
    }
    ```

- To see property and event binding in action, add the following code to your `svg.component.svg` file:

  - src/app/svg.component.svg

    ```
    <svg>
      <g>
        <rect x="0" y="0" width="100" height="100" [attr.fill]="fillColor" (click)="changeColor()" />
        <text x="120" y="50">click the rectangle to change the fill color</text>
      </g>
    </svg>
    ```

  - The example given uses a `click()` event binding and the property binding syntax (`[attr.fill]="fillColor"`).
