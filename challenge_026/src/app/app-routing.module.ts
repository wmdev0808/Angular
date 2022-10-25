import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccessibilityComponent } from './accessibility/accessibility.component';
import { PropertyBindingComponent } from './property-binding/property-binding.component';
import { SecurityComponent } from './security/security.component';

const routes: Routes = [
  { path: '', redirectTo: 'security', pathMatch: 'full' },
  { path: 'security', component: SecurityComponent },
  { path: 'accessibility', component: AccessibilityComponent },
  { path: 'property-binding', component: PropertyBindingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
