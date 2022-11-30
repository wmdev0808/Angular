import { CdkStepper } from '@angular/cdk/stepper';
import { Component } from '@angular/core';

/** @title A custom CDK stepper without a form */
@Component({
  selector: 'app-example-custom-stepper',
  templateUrl: './example-custom-stepper.component.html',
  styleUrls: ['./example-custom-stepper.component.scss'],
})
export class ExampleCustomStepperComponent {}

/** Custom CDK stepper component */
@Component({
  selector: 'example-custom-stepper',
  templateUrl: './example-custom-stepper.html',
  styleUrls: ['./example-custom-stepper.scss'],
  providers: [{ provide: CdkStepper, useExisting: CustomStepper }],
})
export class CustomStepper extends CdkStepper {
  selectStepByIndex(index: number): void {
    this.selectedIndex = index;
  }
}
