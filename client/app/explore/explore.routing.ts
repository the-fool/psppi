import { Routes } from '@angular/router';
import { ExploreComponent } from './explore.component';
import { InitialData, QuestionData } from './explore.resolvers';
import { ExploreDemogGuard } from './explore-demog.guard';
export const ROUTES: Routes = [
    {
        path: 'explore',
        resolve: {
            iniialData: InitialData,
        },
        children: [
            {
                path: ':question',
                component: ExploreComponent,
                resolve: {
                    questionData: QuestionData
                }
            }
        ]
    }
];
