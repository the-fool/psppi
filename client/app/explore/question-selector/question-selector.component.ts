import { Component, EventEmitter, OnInit, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'question-selector',
    styleUrls: ['./question-selector.scss'],
    encapsulation: ViewEncapsulation.None,
    template: `
    <div>
   <ng-select   [allowClear]="true"
                [active]="init"
                [items]="questions"
                (selected)="onSelectQuestion.emit($event)"
                placeholder="No question selected"></ng-select>
    <h3>{{selected?.text}}</h3>
    <div *ngFor="let group of groupedQuestions">
    <ul>
        <li *ngFor="let q of group.questions">
            {{q.text}}
        </li>
    </ul>
    </div>
    
    </div>
    `
})
export class QuestionSelectorComponent {
    @Input() selected: IQuestion;
    @Input() groupedQuestions:  {group: string, questions: IQuestion}[];
    @Input() questions: SelectChildrenItem[];
    @Input() init: IQuestion;
    @Output() onSelectQuestion = new EventEmitter<{id: number|string, text: string}>();

}
