import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Super Caro 2021';
  constructor() {
    localStorage.setItem('loading_register', 'false');
  }
}
