import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'demography-selector',
    template: `
    <div class="btn-group-vertical">
    <button *ngFor="let d of demographies" type="button" [disabled]="d.disabled" [ngClass]="{'active': d.active}"
        (click)="onSelectDemog.emit(d.code)" class="btn btn-primary">
    {{d.nice}}
    </button>
    </div>
    `
})
export class DemographySelectorComponent {
    @Input() demographies: IDemographySelectOption[];
    @Output() onSelectDemog = new EventEmitter<string>();

}
