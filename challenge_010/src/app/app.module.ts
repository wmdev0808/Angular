import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HeroFormReactiveComponent } from './hero-form-reactive/hero-form-reactive.component';
import { HeroFormTemplateComponent } from './hero-form-template/hero-form-template.component';
import { FormValidationComponent } from './form-validation/form-validation.component';
import { AlterEgoDirective } from './shared/alter-ego.directive';
import { ForbiddenNameDirective } from './shared/forbidden-name.directive';
import { IdentityRevealedDirective } from './shared/identity-revealed.directive';
import { NoPageComponent } from './no-page/no-page.component';
import { DynamicFormContainerComponent } from './dynamic-form-container/dynamic-form-container.component';
import { DynamicFormQuestionComponent } from './dynamic-form-question/dynamic-form-question.component';
import { DynamicFormComponent } from './dynamic-form/dynamic-form.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HeroFormReactiveComponent,
    HeroFormTemplateComponent,
    FormValidationComponent,
    AlterEgoDirective,
    ForbiddenNameDirective,
    IdentityRevealedDirective,
    NoPageComponent,
    DynamicFormContainerComponent,
    DynamicFormQuestionComponent,
    DynamicFormComponent,
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
