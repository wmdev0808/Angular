import { Component, Input } from '@angular/core';
import { Item } from '../item';
import { ITEMS } from '../mock-items';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
})
export class ItemListComponent {
  listItems = ITEMS;
  @Input() items: Item[] = [];
}
