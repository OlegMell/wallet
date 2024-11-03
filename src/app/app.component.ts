import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';

import { Header } from './components/header/header.component';

@Component( {
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    RouterOutlet,
    Header,
  ],
} )
export class AppComponent {
  constructor() {
    throw new Error( 'Error' );
  }
}
