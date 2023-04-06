import { Component } from '@angular/core';
import { Hero } from './hero';
import { HeroService } from './hero.service';

@Component({
  selector: 'app-hero-list',
  template: `
    <div *ngFor="let hero of heroes">
      {{ hero.id }} - {{ hero.name }} ({{
        hero.isSecret ? 'secret' : 'public'
      }})
    </div>
  `,
})
export class HeroListComponent {
  heroes: Hero[];

  constructor(heroService: HeroService) {
    this.heroes = heroService.getHeroes();
  }
}
