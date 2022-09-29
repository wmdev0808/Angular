import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { CanDeactivateGuard } from './servers/edit-server/can-deactivate.guard';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { HomeComponent } from './home/home.component';
import { EditServerComponent } from './servers/edit-server/edit-server.component';
import { ServerResolverService } from './servers/server/server-resolver.service';
import { ServerComponent } from './servers/server/server.component';
import { ServersComponent } from './servers/servers.component';
import { UserComponent } from './users/user/user.component';
import { UsersComponent } from './users/users.component';
import { ErrorPageComponent } from './error-page/error-page.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'users',
    component: UsersComponent,
    children: [{ path: ':id/:name', component: UserComponent }],
  },
  {
    path: 'servers',
    // canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    component: ServersComponent,
    children: [
      {
        path: ':id',
        component: ServerComponent,
        resolve: { server: ServerResolverService },
      },
      {
        path: ':id/edit',
        component: EditServerComponent,
        canDeactivate: [CanDeactivateGuard],
      },
    ],
  },
  // {path: 'not-found', component: PageNotFoundComponent},
  {
    path: 'not-found',
    component: ErrorPageComponent,
    data: { message: 'Page not found!' },
  },
  { path: '**', redirectTo: '/not-found' },
];

@NgModule({
  imports: [
    // RouterModule.forRoot(routes, {useHash: true})
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
