import { Component } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { compose, curry, equals, find, isNil, map, merge, prepend, toPairs, prop, keys } from 'ramda';


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
    private demographyOptions$: Observable<IDemographySelectOption[]>;
    private yearOptions$: Observable<IYearSelectOption[]>;
    private selectedYear$ = new BehaviorSubject<string>('all');
    // private selectedDemog$ = new BehaviorSubject<string>('any');
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
        this.demography$ = store.select(s => s.demography);
        this.questionOptions$ = store.select(s => s.questions).map(qs => {
            const child = (o: {code: string, text: string}) =>
                ({id: prop<number>('id', o), text: prop<string>('text', o)});
            const parent = (grp: [string, {code: string, text: string}[]]) =>
                ({text: grp[0], children: map(child, grp[1])});
            return map(parent, toPairs(qs));
        });

        this.yearOptions$ = Observable.combineLatest(
            selectedQuestion$,
            this.selectedYear$,
            (question, selectedYear) => {
                // TODO: get from api
                const YEARS = ['all', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016'];
                const activeYears = keys(question.responses);
                const constructYearOption = (value: string): IYearSelectOption => {
                    const active = (value === selectedYear);
                    const disabled = (value === 'all') ? false : isNil(find(equals(value), activeYears));
                    return {value, active, disabled};
                };
                return map(constructYearOption, YEARS);
            }
        );
        // if a demography option is not available, it should be 'disabled'
        // and if a demography optin is selected, it should be set to 'active'
        this.demographyOptions$ = Observable.combineLatest(
            store.select(s => s.demography), // all possible demographic variables
            selectedQuestion$,  // the current question
            this.selectedYear$,  // the current year filter
            (demogs, question, year) => {
                // Is this insane -- or elegant?
                const allDemogs = prepend({code: 'any', nice: 'Any'}, demogs);
                const code = prop('code');
                const selectedDemog = question.demog;
                const possibleDemographies =
                            (year === 'all') ?
                            question.demographies :
                            question.responses[year] ?
                                question.responses[year].demographies :
                                [];
                const toDemogOption = (d: IDemography): IDemographySelectOption => {
                        const active = (code(d) === selectedDemog);
                        const disabled = (code(d) === 'any') ? false : isNil(find(equals(code(d)), possibleDemographies));
                        return merge(d, {active, disabled});
                    };
                const ret = map(toDemogOption, allDemogs);
                console.log(ret);
                return ret;
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

    onSelectDemog(code: string) {
        
    }
}
