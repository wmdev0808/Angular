import { NgForm } from '@angular/forms';
import { Component, ViewChild } from '@angular/core';

@Component({
  selector: 'app-assignment-td',
  templateUrl: './assignment-td.component.html',
  styleUrls: ['./assignment-td.component.scss'],
})
export class AssignmentTdComponent {
  subscriptions = ['Basic', 'Advanced', 'Pro'];
  selectedSubscription = 'Advanced';
  @ViewChild('signupForm') signUpForm!: NgForm;

  onSubmit() {
    console.log(this.signUpForm.value);
  }
}
