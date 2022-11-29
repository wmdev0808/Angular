import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormFieldCustomControlExampleComponent } from './form-field-custom-control-example/form-field-custom-control-example.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'custom-form-field-control' },
  {
    path: 'custom-form-field-control',
    component: FormFieldCustomControlExampleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
