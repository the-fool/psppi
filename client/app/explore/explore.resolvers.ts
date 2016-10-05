import { Resolve, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../core/api.service';
import { Store } from '@ngrx/store';
import { setDemography, setQuestions } from '../core/reducers';
import { QuestionService } from '../core/question.service';
import { find, flatten, isEmpty, propEq, values } from 'ramda';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';

@Injectable()
export class InitialData implements Resolve<any> {
    constructor(
        private api: ApiService,
        private store: Store<AppState>
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const batch = [];
        ['questions', 'demography'].forEach(url =>
            batch.push(this.api.request('get', `${url}/`))
        );

        return Observable.forkJoin(batch).do(ar => {
            this.store.dispatch(setQuestions(<IQuestion[]>ar[0]));
            this.store.dispatch(setDemography(<IDemography>ar[1]));
        });
    }
}

@Injectable()
export class QuestionData implements Resolve<any> {
    constructor(
        private api: ApiService,
        private questionService: QuestionService,
        private router: Router,
        private store: Store<AppState>,
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const qID = +route.params['question'];
        return this.store.select(s => s.questions)
            .skipWhile(qs => isEmpty(qs))
            .take(1)
            .map(groupedQs => flatten(values(groupedQs)))
            .switchMap(qs => {
                const flag = !!find(propEq('id', qID), qs);
                if (!flag) {
                    this.router.navigate([`/explore/${qs[0].id}`]);
                    return Observable.of(false);
                } else {
                    return this.questionService.fetchQuestionData(qID);
                }
            });
    }
}
