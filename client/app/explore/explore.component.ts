import { Component } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { compose, curry, equals, find, isNil, map, merge, toPairs, prop, keys } from 'ramda';
@Component({
    template: `
    <h1>Explore the Data!</h1>
    <demography-selector [allDemogs]="demography$ | async" [demographies]="demographyOptions$ | async">
    </demography-selector>
    <year-selector [years]="yearOptions$ | async" (onSelectYear)="onSelectYear($event)">
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
    private selectedYear$ = new BehaviorSubject<string>('all');
    private initSelectedQuestion$: Observable<IQuestion[]>;
    private questionOptions$: Observable<SelectChildrenItem[]>;
    constructor(
        private route: ActivatedRoute,
        private store: Store<AppState>,
        private router: Router
    ) {
        console.log('cunstruct');

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

        // if a demography option is not available, it should be 'disabled'
        // and if a demography optin is selected, it should be set to 'active'
        this.demographyOptions$ = Observable.combineLatest(
            store.select(s => s.demography), // all possible demographic variables
            selectedQuestion$,  // the current question
            this.selectedYear$,  // the current year filter
            (allDemogs, question, year) => {
                // Is this insane -- or elegant?
                const selectedDemog = question.demog;
                const toDemogOption = curry(
                    (dList: string[], d: IDemography): IDemographySelectItem => {
                        const active = d.code === selectedDemog;
                        const disabled = isNil(find(equals(d.code), dList));
                        return merge(d, {active, disabled});
                    });
                const possibleDemographies =
                            (year === 'all') ?
                            question.demographies :
                            question.responses[year] ?
                                question.responses[year].demographies :
                                [];
                return map(toDemogOption(possibleDemographies), allDemogs);
            }
        );
    }

    onSelectQuestion({id, text}) {
        console.log(id);
        this.router.navigate([`/explore/${id}`]);
    }

    onSelectYear(year: string) {
        this.selectedYear$.next(year);
    }
}
