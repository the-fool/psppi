import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'year-selector',
    template: `
    <div class="btn-group-vertical">
    <button *ngFor="let year of years" type="button" [disabled]="year.disabled"
        [ngClass]="{'active': year.active}"
        (click)="onSelectYear.emit(year.value)" class="btn btn-primary">
        {{year.value}}
    </button>
    </div>
    `
})
export class YearSelectorComponent {
    @Input() years: IYearSelectOption[];
    @Output() onSelectYear = new EventEmitter<string>();
}
