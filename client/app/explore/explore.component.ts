import { Component } from '@angular/core';
import { QuestionService } from '../core/question.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { compose, curry, equals, find, isNil, lensProp, map, merge, prepend, prop, reduce, set, toPairs, keys } from 'ramda';


@Component({
    template: `
    <div>
        <div id="question-selector-wrapper">
            <question-selector [questions]="questionOptions$ | async" [init]="initSelectedQuestion$ | async"
            (onSelectQuestion)="onSelectQuestion($event)">
            </question-selector>
        </div>
        <div id="abs-wrapper">
        <div class="row" id="viz-widgets">
            <div id="demog-selector">
                <demography-selector [demographies]="demographyOptions$ | async"
                (onSelectDemog)="onSelectDemog($event)">
                </demography-selector>
            </div>
            <div id="chart-wrapper">
                <chart [questionData]="questionData$ | async" [year]="selectedYear$ | async" [demogDict]="demographyDict$ | async"></chart>
            </div>
            <div id="year-selector">
                <year-selector [years]="yearOptions$ | async" (onSelectYear)="onSelectYear($event)">
                </year-selector>
            </div>
        </div>
        </div>        
    </div>
    `,
    styleUrls: ['explore.style']
})
export class ExploreComponent {
    private demographyOptions$: Observable<IDemographySelectOption[]>;
    private demographyDict$: Observable<{[code: string]: IDemography}>;
    private questionData$: Observable<IQuestionData>;
    private yearOptions$: Observable<IYearSelectOption[]>;
    private selectedYear$ = new BehaviorSubject<string>('all');
    private initSelectedQuestion$: Observable<IQuestion[]>;
    private questionOptions$: Observable<SelectChildrenItem[]>;
    constructor(
        private store: Store<AppState>,
        private router: Router,
        private questionService: QuestionService
    ) {
        this.questionData$ = store.select(s => s.data);
        this.demographyDict$ = store.select(s => s.demography)
                                    .map(reduce((a, i) => set(lensProp(prop<string>('code', i)), i, a), {}));
        // for some reason, ng2-select wants an array
        this.initSelectedQuestion$ = this.questionData$.map(Array).take(1);
        this.questionOptions$ = store.select(s => s.questions).map(qs => {
            const child = (o: {code: string, text: string}) =>
                ({id: prop<number>('id', o), text: prop<string>('text', o)});
            const parent = (grp: [string, {code: string, text: string}[]]) =>
                ({text: grp[0], children: map(child, grp[1])});
            return map(parent, toPairs(qs));
        });

        this.yearOptions$ = Observable.combineLatest(
            this.questionData$,
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
            this.questionData$,  // the current question
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
                return map(toDemogOption, allDemogs);
            }
        );
    }

    onSelectQuestion({id, text}) {
        this.selectedYear$.next('all');
        this.router.navigate([`/explore/${id}`]);
    }

    onSelectYear(year: string) {
        this.selectedYear$.next(year);
    }

    onSelectDemog(code: string) {
        const demog = (code !== 'any') ? code : null;
        this.store.select(s => s.data)
            .map(prop('id'))
            .take(1)
            .subscribe(id => this.questionService.fetchQuestionData(+id, demog));
    }
}
