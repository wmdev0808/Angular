import { QuestionService } from './../shared/question.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { QuestionBase } from '../shared/question-base.model';

@Component({
  selector: 'app-dynamic-form-container',
  templateUrl: './dynamic-form-container.component.html',
  styleUrls: ['./dynamic-form-container.component.scss'],
  providers: [QuestionService],
})
export class DynamicFormContainerComponent {
  questions$: Observable<QuestionBase<any>[]>;
  constructor(private questionService: QuestionService) {
    this.questions$ = this.questionService.getQuestions();
  }
}
