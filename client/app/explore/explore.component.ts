import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { compose, prop, keys } from 'ramda';
@Component({
    template: `
    <h1>Explore the Data!</h1>
    <demography-selector [allDemogs]="demography$ | async"></demography-selector>
    <year-selector [years]="yearOptions$ | async"></year-selector>
    `
})
export class ExploreComponent {
    private demography$: Observable<IDemography[]>;
    private groupedQuestions$: Observable< {[group: string]: IQuestion[]}>;
    private yearOptions$: Observable<string[]>;
    constructor(
        private route: ActivatedRoute,
        private store: Store<AppState>
    ) {
        const selectedQuestion$ = route.data.map(d => d['questionData']).do(console.log);
        this.yearOptions$ = selectedQuestion$.map(compose(keys, prop('responses')));
        this.demography$ = store.select(s => s.demography);
        this.groupedQuestions$ = store.select(s => s.questions);
    }
}
