import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full'
  },
  {
    path: 'overview',
    loadComponent: () =>
      import('./students/student-overview/student-overview.component').then(
        (m) => m.StudentOverviewComponent
      )
  },
  {
    path: '**',
    redirectTo: 'overview'
  }
];
