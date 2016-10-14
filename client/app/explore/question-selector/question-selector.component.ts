import { Component, EventEmitter, OnInit, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'question-selector',
  styleUrls: ['./question-selector.scss'],
  encapsulation: ViewEncapsulation.None,
  template: `
  <div>
  <div id="selected-question" class="card card-block"> 
    <h4 class="card-title"><span id="group-heading">{{selected?.group | uppercase}}</span> | {{selected?.short}}</h4>
    <p class="card-text">{{selected?.text}}</p>
    <a id="open-question-modal" class="card-link " 
      (click)="qModal.show()">
      Select a different question . . . 
    </a>
  </div>

    
  <div bsModal #qModal="bs-modal" class="modal fade" tabindex="-1" role="dialog" 
       aria-labelledby="selectQuestionModal" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" (click)="qModal.hide()" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h3 class="modal-title">Please select a question . . .</h3>
        </div>
        <div class="modal-body">
          <squeezebox [multiple]="false">
            <sb-item *ngFor="let group of groupedQuestions" [ngClass]="{'selected': group.group == selected.group}">
            <sb-item-head>{{group.group | uppercase}}</sb-item-head>
            <sb-item-body>
              <div class="list-group">
                    <button type="button" 
                      class="list-group-item list-group-item-action"
                      [ngClass]="{'active': q.id === selected.id}" 
                      *ngFor="let q of group.questions"
                      (click)="onSelectQuestion.emit(q); qModal.hide()">
                    {{q.short}}
                    </button>
              </div>
            </sb-item-body>
            </sb-item>
          </squeezebox>
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
