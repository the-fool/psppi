import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import SharedModule from '../shared/shared.module';
import { ExploreResolver } from './explore.resolver';
import { ExploreDemogGuard } from './explore-demog.guard';
import { ExploreComponent } from './explore.component';

import { DemographyComponent } from './demography/demography.component';

import { ROUTES } from './explore.routing';
@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(ROUTES)
    ],
    providers: [
        ExploreResolver,
        ExploreDemogGuard
    ],
    declarations: [
        DemographyComponent,
        ExploreComponent
    ]
})
export default class ExploreModule {}
