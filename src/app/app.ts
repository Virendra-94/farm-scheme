import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/shared/header/header';
import { FooterComponent } from './components/shared/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class AppComponent {
  title = 'Farm Scheme';
}

export { AppComponent as App };
