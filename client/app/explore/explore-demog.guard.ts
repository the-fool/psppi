import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/take';
import { find, propEq, isEmpty } from 'ramda';
import {
  Resolve, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable()
export class ExploreDemogGuard implements Resolve<any> {
  constructor(
    private store: Store<AppState>,
    private router: Router
  ) { }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> | Observable<boolean> | boolean {
    const demog = route.params['demog'];
    const year = route.params['year'];
    if (demog === 'any') { return true; }
    if (!demog || !year) {
      this.router.navigate(['/explore', 'any', 'all']);
      return false;
    }
    return this.store
      .select(s => s.demography)
      .skipWhile(d => isEmpty(d)) // wait for other ajax to resolve
      .map(demogs => !!find(propEq('code', demog), demogs))
      .take(1)
      .map(flag => {
        if (!flag) {
          console.log('illegal demog');
          this.router.navigate(['/explore', 'any', year]);
          return false;
        } else {
          return true;
        }
      });
  }
}

