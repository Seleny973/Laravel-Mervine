import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product-service';
import { UserService } from '../../services/user-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrls: ['./admin.scss']
})
export class Admin {
  products: any[] = [];
  users: any[] = [];
  constructor(
    private productService: ProductService,
    private userService: UserService,
    private router: Router
  ){ }

  ngOnInit(){
    this.productService.getProducts().subscribe({
      next: (p: any) => {
        this.products = p;
      }, error: (e:any) => console.error(e)
    });

    this.userService.getAll().subscribe({
      next: (u: any) => {
        this.users = u;
      }, error: (e:any) => console.error(e)
    });
  }

  delete(product: any){
    if (!product || !product.id) return;
    if (!confirm('Supprimer le produit "' + product.title + '" ?')) return;
    this.productService.deleteProductRemote(product.id).subscribe({
      next: (res:any) => {
        // remove locally from view
        this.products = this.products.filter(x => x.id !== product.id);
        // also remove from cart if present
        this.productService.removeFromCart(product.id);
      },
      error: (err:any) => {
        console.error('Erreur suppression', err);
        alert('Impossible de supprimer le produit sur le remote');
      }
    });
  }
}
