import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ApiService } from '../core/api.service';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/toPromise';
@Injectable()
export class ExploreResolver implements Resolve<any> {
    private apiUrl = 'http://127.0.0.1:8000/api/v1';
    constructor(
        private api: ApiService
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        const batch = [];
        ['questions', 'demography'].forEach(url =>
            batch.push(
                this.api.request('get', `${url}/`)
                  .then(res => console.log(res))
            )
        );

        return Observable.forkJoin(batch);
    }
}
