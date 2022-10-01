import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicFormContainerComponent } from './dynamic-form-container/dynamic-form-container.component';
import { FormValidationComponent } from './form-validation/form-validation.component';
import { NoPageComponent } from './no-page/no-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/form-validation', pathMatch: 'full' },
  { path: 'form-validation', component: FormValidationComponent },
  { path: 'dynamic-form', component: DynamicFormContainerComponent },
  { path: '**', component: NoPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
