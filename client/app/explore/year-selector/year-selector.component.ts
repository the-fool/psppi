import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'year-selectors',
    template: `
    <div class="btn-group-vertical">
    <button *ngFor="let year of years" type="button" 
        (click)="selectYear.emit(year)" class="btn btn-primary">
        {{year}}
    </button>
    </div>
    `
})
export class YearSelectorComponent {
    @Input() years: number[];
    @Output() selectYear = new EventEmitter<string>();

}
