import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
@Component({
    template: `
    <h1>Explore the Data!</h1>
    <demography-selectors [allDemogs]="demography$ | async"></demography-selectors>
    `
})
export class ExploreComponent {
    private demography$: Observable<IDemography[]>;
    private groupedQuestions$: Observable< {[group: string]: IQuestion[]}>;
    constructor(
        private route: ActivatedRoute,
        private store: Store<AppState>
    ) {
        this.demography$ = store.select(s => s.demography);
        this.groupedQuestions$ = store.select(s => s.questions);
        route.data.subscribe(d => console.log(d))
    }
}
