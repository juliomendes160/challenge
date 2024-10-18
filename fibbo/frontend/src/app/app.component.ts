import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProdutoComponent } from './produto/component/produto.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ProdutoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'fibbo';
}
