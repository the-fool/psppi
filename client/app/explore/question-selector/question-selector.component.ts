import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'question-selector',
    template: `
    <div>
   <ng-select [allowClear]="true"
             [items]="questions"
             (selected)="onSelectQuestion.emit($event)"
             placeholder="No question selected"></ng-select>
    </div>
    `
})
export class QuestionSelectorComponent {
    @Input() questions: SelectChildrenItem[];
    @Output() onSelectQuestion = new EventEmitter<{id: number|string, text: string}>();
}
