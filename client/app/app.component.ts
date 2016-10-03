/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation, ViewContainerRef } from '@angular/core';

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.style.css'
  ],
  template: `
    <router-outlet></router-outlet>
  `
})
export class App {
  private viewContainerRef: ViewContainerRef;
  constructor(viewContainerRef: ViewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }
}
