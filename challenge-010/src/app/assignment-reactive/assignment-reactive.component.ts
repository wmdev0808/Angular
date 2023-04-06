import { Component, OnInit } from '@angular/core';
import {
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CustomValidators } from './custom-validators';

@Component({
  selector: 'app-assignment-reactive',
  templateUrl: './assignment-reactive.component.html',
  styleUrls: ['./assignment-reactive.component.scss'],
})
export class AssignmentReactiveComponent implements OnInit {
  projectForm!: FormGroup;

  ngOnInit() {
    this.projectForm = new FormGroup({
      projectName: new FormControl(
        null,
        [Validators.required, CustomValidators.invalidProjectName],
        CustomValidators.asyncInvalidProjectName as AsyncValidatorFn
      ),
      email: new FormControl(null, [Validators.required, Validators.email]),
      projectStatus: new FormControl('critical'),
    });
  }

  get projectName() {
    return this.projectForm.get('projectName')!;
  }

  get email() {
    return this.projectForm.get('email')!;
  }

  get projectStatus() {
    return this.projectForm.get('projectStatus')!;
  }

  onSaveProject() {
    console.log(this.projectForm.value);
  }
}
