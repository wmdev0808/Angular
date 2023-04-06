import { Directive } from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  ValidationErrors,
  Validator,
  ValidatorFn,
} from '@angular/forms';

/** A hero's name can't match the hero's alter ego */
export const identityRevealedValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const name = control.get('name');
  const alterEgo = control.get('alterEgo');

  return name && alterEgo && name.value === alterEgo.value
    ? { identityRevealed: true }
    : null;
};

@Directive({
  selector: '[appIdentityRevealed]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: IdentityRevealedDirective,
      multi: true,
    },
  ],
})
export class IdentityRevealedDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    return identityRevealedValidator(control);
  }
}
