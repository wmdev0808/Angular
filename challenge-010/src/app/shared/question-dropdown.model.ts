import { QuestionBase } from './question-base.model';

export class DropdownQuestion extends QuestionBase<string> {
  override controlType = 'dropdown';
}
