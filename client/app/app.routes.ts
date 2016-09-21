import { Routes, RouterModule } from '@angular/router';

import { ROUTES as ExploreRoutes } from './explore';

export const ROUTES: Routes = [
  ...ExploreRoutes,
  { path: '**',    redirectTo: '/explore' },
];
