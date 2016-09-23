import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { compose, map, toPairs, prop, keys } from 'ramda';
@Component({
    template: `
    <h1>Explore the Data!</h1>
    <demography-selector [allDemogs]="demography$ | async">
    </demography-selector>
    <year-selector [years]="yearOptions$ | async">
    </year-selector>
    <question-selector [questions]="questionOptions$ | async" [init]="initSelectedQuestion$ | async"
        (onSelectQuestion)="onSelectQuestion($event)">
    </question-selector>
    `
})
export class ExploreComponent {
    private demography$: Observable<IDemography[]>;
    private demographyOptions$: Observable<IDemographySelectItem[]>;
    private yearOptions$: Observable<string[]>;
    private initSelectedQuestion$: Observable<IQuestion[]>;
    private questionOptions$: Observable<SelectChildrenItem[]>;
    constructor(
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private router: Router
    ) {
        const selectedQuestion$ = route.data.map(d => d['questionData']);

        // for some reason, ng2-select wants an array
        this.initSelectedQuestion$ = selectedQuestion$.map(Array).take(1);
        this.yearOptions$ = selectedQuestion$.map(compose(keys, prop('responses')));
        this.demography$ = store.select(s => s.demography);
        this.questionOptions$ = store.select(s => s.questions).map(qs => {
            const child = (o: {code: string, text: string}) =>
                ({id: prop<number>('id', o), text: prop<string>('text', o)});
            const parent = (grp: [string, {code: string, text: string}[]]) =>
                ({text: grp[0], children: map(child, grp[1])});
            return map(parent, toPairs(qs));
        });
        this.demographyOptions$ = Observable.combineLatest(
            store.select(s => s.demography),
            selectedQuestion$,
            (d, q) => ([{code: '', text: '', active: true, disabled: false}])
        );
    }

    onSelectQuestion({id, text}) {
        console.log(id);
        this.router.navigate([`/explore/${id}`]);
    }
}
