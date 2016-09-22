import { Routes } from '@angular/router';
import { ExploreComponent } from './explore.component';
import { ExploreResolver } from './explore.resolver';
import { ExploreDemogGuard } from './explore-demog.guard';
export const ROUTES: Routes = [
    {
        path: 'explore/:demog/:year',
        component: ExploreComponent,
        resolve: {
            initialData: ExploreResolver,
            guard: ExploreDemogGuard
        },
    }
];
