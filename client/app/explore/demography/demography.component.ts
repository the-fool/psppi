import { Component, Input, OnChanges } from '@angular/core';

@Component({
    selector: 'demography-selectors',
    template: `
        <ul>
            <li *ngFor="let d of allDemogs">
            <p>{{d.code}}</p>
            <div class="btn-group">
                <label class="btn btn-primary" *ngFor="let kv of (d.values | toPairs)"
                    btnCheckbox>{{kv[1]}}</label>
            </div>
            </li>
        </ul>
    `
})
export class DemographyComponent implements OnChanges {
    @Input() allDemogs: IDemography[];
    @Input() employableDemogs: number[]; // list of keys
    private 
    ngOnChanges(simpleChanges) {
        if (simpleChanges['allDemogs'].currentValue) {

        }
    }
}
