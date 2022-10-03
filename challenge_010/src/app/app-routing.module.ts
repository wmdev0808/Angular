import { AssignmentReactiveComponent } from './assignment-reactive/assignment-reactive.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssignmentTdComponent } from './assignment-td/assignment-td.component';
import { DynamicFormContainerComponent } from './dynamic-form-container/dynamic-form-container.component';
import { FormReactiveComponent } from './form-reactive/form-reactive.component';
import { FormTemplateComponent } from './form-template/form-template.component';
import { FormValidationComponent } from './form-validation/form-validation.component';
import { NoPageComponent } from './no-page/no-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/form-validation', pathMatch: 'full' },
  { path: 'form-validation', component: FormValidationComponent },
  { path: 'dynamic-form', component: DynamicFormContainerComponent },
  { path: 'form-template', component: FormTemplateComponent },
  { path: 'form-reactive', component: FormReactiveComponent },
  { path: 'assignment-template', component: AssignmentTdComponent },
  { path: 'assignment-reactive', component: AssignmentReactiveComponent },
  { path: '**', component: NoPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
