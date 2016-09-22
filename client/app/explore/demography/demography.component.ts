import { Component, Input } from '@angular/core';

@Component({
    selector: 'demography-selectors',
    template: `
        <ul>
            <li *ngFor="let d of demography">
            <p>{{d.code}}</p>
            </li>
        </ul>
    `
})
export class DemographyComponent {
    @Input() demography: IDemography[];
}
