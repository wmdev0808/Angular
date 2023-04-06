import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  FormFieldCustomControlExampleComponent,
  MyTelInput,
} from './form-field-custom-control-example/form-field-custom-control-example.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialExampleModule } from 'src/material.module';
import { ElevationOverviewExampleComponent } from './elevation-overview-example/elevation-overview-example.component';
import {
  CustomStepper,
  ExampleCustomStepperComponent,
} from './example-custom-stepper/example-custom-stepper.component';

@NgModule({
  declarations: [
    AppComponent,
    FormFieldCustomControlExampleComponent,
    MyTelInput,
    ElevationOverviewExampleComponent,
    ExampleCustomStepperComponent,
    CustomStepper,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialExampleModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
