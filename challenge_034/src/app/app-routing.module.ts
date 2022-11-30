import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElevationOverviewExampleComponent } from './elevation-overview-example/elevation-overview-example.component';
import { ExampleCustomStepperComponent } from './example-custom-stepper/example-custom-stepper.component';
import { FormFieldCustomControlExampleComponent } from './form-field-custom-control-example/form-field-custom-control-example.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'custom-form-field-control' },
  {
    path: 'custom-form-field-control',
    component: FormFieldCustomControlExampleComponent,
  },
  { path: 'elevation', component: ElevationOverviewExampleComponent },
  { path: 'custom-stepper', component: ExampleCustomStepperComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
