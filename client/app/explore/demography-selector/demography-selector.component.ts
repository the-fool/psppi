import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'demography-selector',
    template: `
    <div class="btn-group-vertical">
    <button *ngFor="let d of allDemogs" type="button" 
        (click)="selectDemog.emit(d.code)" class="btn btn-primary">
    {{d.nice}}
    </button>
    </div>
    `
})
export class DemographySelectorComponent {
    @Input() allDemogs: IDemography[];
    @Input() employableDemogs: number[]; // list of keys
    @Output() selectDemog = new EventEmitter<string>();

}