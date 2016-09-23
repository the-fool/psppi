import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'demography-selectors',
    template: `
        <ul>
            <li *ngFor="let d of allDemogs">
            <p>{{d.nice}}</p>
            </li>
        </ul>
    `
})
export class DemographyComponent implements OnChanges {
    @Input() allDemogs: IDemography[];
    @Input() employableDemogs: number[]; // list of keys
    ngOnChanges(simpleChanges) {
        if (simpleChanges['allDemogs'].currentValue) {

        }
    }
}
