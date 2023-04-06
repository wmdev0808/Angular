import { Component } from '@angular/core';

@Component({
  selector: 'app-inner-html-binding',
  templateUrl: './inner-html-binding.component.html',
})
export class InnerHtmlBindingComponent {
  // For example, a user/attacker-controlled value from a URL.
  htmlSnippet = 'Template <script>alert("0wned")</script> <b>Syntax</b>';
}
