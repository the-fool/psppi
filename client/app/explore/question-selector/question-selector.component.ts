import { Component, EventEmitter, OnInit, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'question-selector',
  styleUrls: ['./question-selector.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
  <div>
  <h3>{{selected?.text}}</h3>
  <button id="open-question-modal" class="btn btn-primary pull-md-right" 
    (click)="qModal.show()">
    Select a different question
  </button>
    
  <div bsModal #qModal="bs-modal" class="modal fade" tabindex="-1" role="dialog" 
       aria-labelledby="selectQuestionModal" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" (click)="qModal.hide()" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 class="modal-title">Please select a question . . .</h4>
        </div>
        <div class="modal-body">
          <div *ngFor="let group of groupedQuestions">
            <h3 class="question-group-heading">{{group.group | uppercase}}</h3>
            <div class="list-group">
              <button type="button" 
                class="list-group-item list-group-item-action"
                [ngClass]="{'active': q.id === selected.id}" 
                *ngFor="let q of group.questions"
                (click)="onSelectQuestion.emit(q); qModal.hide()">
              {{q.text}}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
    `
})
export class QuestionSelectorComponent {
  @Input() selected: IQuestion;
  @Input() groupedQuestions: { group: string, questions: IQuestion }[];
  @Input() questions: SelectChildrenItem[];
  @Input() init: IQuestion;
  @Output() onSelectQuestion = new EventEmitter<{ id: number | string, text: string }>();

}
