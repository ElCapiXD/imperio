import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pages/login',
    pathMatch: 'full'
  },
  {
    path: 'pages/login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'pages/register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'pages/routines',
    loadComponent: () =>
      import('./pages/routines/routines.page').then((m) => m.RoutinesPage),
  },
  {
    path: 'pages/routine-detail/:name',
    loadComponent: () =>
      import('./pages/routine-detail/routine-detail.page').then((m) => m.RoutineDetailPage),
  },
  {
    path: 'pages/memberships',
    loadComponent: () =>
      import('./pages/memberships/memberships.page').then((m) => m.MembershipsPage),
  },
  {
    path: 'pages/profile',
    loadComponent: () =>
      import('./pages/profile/profile.page').then((m) => m.ProfilePage),
  },
  {
    path: 'pages/progress',
    loadComponent: () =>
      import('./pages/progress/progress.page').then((m) => m.ProgressPage),
  },
  {
    path: 'pages/settings',
    loadComponent: () =>
      import('./pages/settings/settings.page').then((m) => m.SettingsPage),
  },
  //
  {
    path: 'pages/history',
    loadComponent: () =>
      import('./pages/history/history.page').then((m) => m.HistoryPage),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
