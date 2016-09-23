import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import SharedModule from '../shared/shared.module';
import { InitialData, QuestionData } from './explore.resolvers';
import { ExploreDemogGuard } from './explore-demog.guard';
import { ExploreComponent } from './explore.component';

import { DemographySelectorComponent } from './demography-selector/demography-selector.component';
import { YearSelectorComponent } from './year-selector/year-selector.component';
import { ROUTES } from './explore.routing';
@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(ROUTES)
    ],
    providers: [
        InitialData,
        QuestionData,
        ExploreDemogGuard
    ],
    declarations: [
        DemographySelectorComponent,
        ExploreComponent
    ]
})
export default class ExploreModule {}
