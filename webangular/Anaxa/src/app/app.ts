import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './composants/header/header';
import { Homepage } from './composants/homepage/homepage';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Header,Homepage],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App {
  protected readonly title = signal('Anaxa');
}
