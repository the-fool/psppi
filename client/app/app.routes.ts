import { Routes, RouterModule } from '@angular/router';

export const ROUTES: Routes = [
  { path: '**',    redirectTo: '/explorer' },
];
