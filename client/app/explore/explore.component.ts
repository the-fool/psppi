import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { compose, map, toPairs, prop, keys } from 'ramda';
@Component({
    template: `
    <h1>Explore the Data!</h1>
    <demography-selector [allDemogs]="demography$ | async"></demography-selector>
    <year-selector [years]="yearOptions$ | async"></year-selector>
    <question-selector [questions]="questionOptions$ | async"></question-selector>
    `
})
export class ExploreComponent {
    private demography$: Observable<IDemography[]>;
    private yearOptions$: Observable<string[]>;
    private questionOptions$: Observable<SelectChildrenItem[]>;
    constructor(
        private route: ActivatedRoute,
        private store: Store<AppState>
    ) {
        console.log(route.data);
        const selectedQuestion$ = route.data.map(d => d['questionData']).do(console.log);
        this.yearOptions$ = selectedQuestion$.map(compose(keys, prop('responses')));
        this.demography$ = store.select(s => s.demography);
        this.questionOptions$ = store.select(s => s.questions).map(qs => {
            const child = (o: {code: string, text: string}) =>
                ({id: prop<number>('id', o), text: prop<string>('text', o)});
            const parent = (grp: [string, {code: string, text: string}[]]) =>
                ({text: grp[0], children: map(child, grp[1])});
            return map(parent, toPairs(qs));
        });
    }
}
