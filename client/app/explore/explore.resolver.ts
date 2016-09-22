import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../core/api.service';
import { Store } from '@ngrx/store';
import { setDemography, setQuestions } from '../core/reducers';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/do';
@Injectable()
export class ExploreResolver implements Resolve<any> {
    private apiUrl = 'http://127.0.0.1:8000/api/v1';
    constructor(
        private api: ApiService,
        private store: Store<AppState>
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const batch = [];
        ['questions', 'demography'].forEach(url =>
            batch.push(
                this.api.request('get', `${url}/`)
                  .then(res => console.log(res))
            )
        );

        return Observable.forkJoin(batch).do(ar => {
            this.store.dispatch(setQuestions(<IQuestion[]>ar[0]));
            this.store.dispatch(setDemography(<IDemography>ar[1]));
        });
    }
}
