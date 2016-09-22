import { Routes } from '@angular/router';
import { ExploreComponent } from './explore.component';
import { ExploreResolver } from './explore.resolver';
import { ExploreDemogGuard } from './explore-demog.guard';
export const ROUTES: Routes = [
    {
        path: 'explore',
        resolve: {
            initialData: ExploreResolver
        },
        children: [
            {
                path: ':demog',
                component: ExploreComponent,
                resolve: {guard: ExploreDemogGuard}
            }
        ]
    }
];
