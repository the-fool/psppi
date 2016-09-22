import { Routes } from '@angular/router';
import { ExploreComponent } from './explore.component';
import { ExploreResolver } from './explore.resolver';

export const ROUTES: Routes = [
    {
        path: 'explore',
        component: ExploreComponent,
        resolve: {
            initialData: ExploreResolver
        }
    }
];
