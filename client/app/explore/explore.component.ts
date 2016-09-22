import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
@Component({
    template: `
    <h1>Explore the Data!</h1>
    <demography-selectors [demography]="demography$ | async"></demography-selectors>
    `
})
export class ExploreComponent {
    private demography$: Observable<IDemography[]>;
    constructor(
        private store: Store<AppState>
    ) {
        this.demography$ = store.select(s => s.demography);
    }
}
