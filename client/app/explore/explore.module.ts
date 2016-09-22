import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import SharedModule from '../shared/shared.module';
import { ExploreResolver } from './explore.resolver';
import { ExploreComponent } from './explore.component';
import { ROUTES } from './explore.routing';
@NgModule({
    imports: [
        SharedModule,
        RouterModule.forChild(ROUTES)
    ],
    providers: [
        ExploreResolver
    ],
    declarations: [
        ExploreComponent
    ]
})
export default class ExploreModule {}
