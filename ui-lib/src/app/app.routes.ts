import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home').then((m) => m.HomeComponent) },
  {
    path: 'ui-showcase',
    loadComponent: () =>
      import('./pages/ui-showcase/ui-showcase').then((m) => m.UIShowcaseComponent),
  },
];
