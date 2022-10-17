import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HeroListAutoCalcPageComponent } from './hero-list-auto-page/hero-list-auto-page.component';
import { HeroListEnterLeavePageComponent } from './hero-list-enter-leave-page/hero-list-enter-leave-page.component';
import { HeroListPageComponent } from './hero-list-page/hero-list-page.component';
import { HomeComponent } from './home/home.component';
import { InsertRemoveComponent } from './insert-remove/insert-remove.component';
import { OpenClosePageComponent } from './open-close-page/open-close-page.component';
import { QueryingComponent } from './querying/querying.component';
import { StatusSliderPageComponent } from './status-slider-page/status-slider-page.component';
import { ToggleAnimationsPageComponent } from './toggle-animations-page/toggle-animations-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/enter-leave' },
  {
    path: 'open-close',
    component: OpenClosePageComponent,
    data: { animation: 'openClosePage' },
  },
  {
    path: 'status',
    component: StatusSliderPageComponent,
    data: { animation: 'statusPage' },
  },
  {
    path: 'toggle',
    component: ToggleAnimationsPageComponent,
    data: { animation: 'togglePage' },
  },
  {
    path: 'heroes',
    component: HeroListPageComponent,
    data: { animation: 'filterPage' },
  },
  {
    path: 'hero-groups',
    component: HeroListPageComponent,
    data: { animation: 'heroGroupPage' },
  },
  {
    path: 'enter-leave',
    component: HeroListEnterLeavePageComponent,
    data: { animation: 'enterLeavePage' },
  },
  {
    path: 'auto',
    component: HeroListAutoCalcPageComponent,
    data: { animation: 'autoPage' },
  },
  {
    path: 'insert-remove',
    component: InsertRemoveComponent,
    data: { animation: 'insertRemovePage' },
  },
  {
    path: 'querying',
    component: QueryingComponent,
    data: { animation: 'queryingPage' },
  },
  {
    path: 'home',
    component: HomeComponent,
    data: { animation: 'HomePage' },
  },
  {
    path: 'about',
    component: AboutComponent,
    data: { animation: 'AboutPage' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
