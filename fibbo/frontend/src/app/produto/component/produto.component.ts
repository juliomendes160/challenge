import { Component } from '@angular/core';
import { Produto } from '../model/produto';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-produto',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './produto.component.html',
  styleUrl: './produto.component.scss'
})
export class ProdutoComponent {
  
  private readonly api = 'http://localhost:8080/produto'
  
  produtos: Produto[] = [];

  produto = new FormGroup({
    nome: new FormControl('', Validators.required),
    preco: new FormControl('', Validators.required),
    descricao: new FormControl('', Validators.required)
  });

  salvar() {
    if (this.produto.valid) {
      console.log('Produto cadastrado:');
    }
  }
}
